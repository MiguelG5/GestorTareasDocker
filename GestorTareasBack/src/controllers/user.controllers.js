const pool = require("../database");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const mailService = require("../mailer.service");
const userCtrl = {};

userCtrl.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Ocurrió un error al intentar obtener los usuarios" });
  }
};
userCtrl.createUser = async (req, res) => {
  try {
    const { username, email, password, role, razon_social, id_colaborador } = req.body;

    // Hash de la contraseña
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Crear un nuevo usuario en la base de datos
    const newUserQuery = `
      INSERT INTO users (username, email, password, role, razon_social, id_colaborador)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;

    const newUserValues = [username, email, hashedPassword, role, razon_social, id_colaborador];

    const result = await pool.query(newUserQuery, newUserValues);

    res.status(201).json({ message: "Registro exitoso", user: result.rows[0] });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: "Ocurrió un error al intentar crear el usuario" });
  }
};

userCtrl.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el nombre de usuario o correo electrónico está presente en la solicitud
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Nombre de usuario/correo electrónico y contraseña son obligatorios",
      });
    }

    // Buscar el usuario en la base de datos por nombre de usuario o correo electrónico
    const userQuery = `
            SELECT * FROM users WHERE email = $1 OR email = $1;
        `;
    const userValues = [email];
    const userResult = await pool.query(userQuery, userValues);

    // Verificar si se encontró el usuario
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = userResult.rows[0];

    // Verificar si la contraseña coincide
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "La contraseña es incorrecta" });
    }

    // En este punto, el usuario ha proporcionado credenciales válidas
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token: createToken(user),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        id_colaborador: user.id_colaborador // Asegurarte de que este campo exista
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res
      .status(500)
      .json({ message: "Ocurrió un error al intentar iniciar sesión" });
  }
};

function createToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    id_colaborador: user.id_colaborador // Asegurarte de que este campo exista
  };
  return jwt.sign(payload, process.env.SECRETJWT, { expiresIn: 60 });
}

userCtrl.resetPassword = async (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const { correo } = req.body;

  const respDb = await pool.query("SELECT email FROM users WHERE email = $1", [
    correo,
  ]);

  if (respDb.rows.length > 0) {
    if (respDb.rows[0].email === correo) {
      const code = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
        time: 120,
      });

      mailService
        .sendCode(correo, code)
        .then(() => {
          res
            .status(200)
            .json(
              generarRespuesta(
                0,
                "Se envió correctamente el código a tu correo.",
                secret.base32,
                null
              )
            );
        })
        .catch((error) => {
          console.log("Ocurrió un error en el sistema.", error);
          res
            .status(200)
            .json(
              generarRespuesta(
                1,
                "Ocurrio un error al enviar el código.",
                null,
                null
              )
            );
        });
    } else {
      res
        .status(200)
        .json(
          generarRespuesta(
            1,
            "El correo electronico no está registrado, verificalo y vuelve a intentarlo.",
            correo,
            null
          )
        );
    }
  } else {
    res
      .status(200)
      .json(
        generarRespuesta(
          1,
          "El correo electronico no está registrado, verificalo y vuelve a intentarlo.",
          correo,
          null
        )
      );
  }
};

userCtrl.updatePassword = async (req, res) => {
  const { correo, password } = req.body;

  const user = await pool.query("SELECT password FROM users WHERE email = $1", [
    correo,
  ]);

  const isEquals = await bcryptjs.compare(password, user.rows[0].password);

  if (isEquals) {
    res
      .status(500)
      .json(
        generarRespuesta(
          1,
          "La nueva contraseña no puede ser igual a la anterior.",
          null,
          null
        )
      );
  } else {
    const resp = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [bcryptjs.hashSync(password, 10), correo]
    );

    if (resp) {
      res
        .status(200)
        .json(
          generarRespuesta(
            0,
            "Se reestablecio correctamente la contraseña",
            null,
            null
          )
        );
    } else {
      res
        .status(500)
        .json(
          generarRespuesta(
            1,
            "Ocurrió un error al actualizar la contraseña.",
            null,
            null
          )
        );
    }
  }
};

userCtrl.validCode = (req, res) => {
  const { codigo, secret } = req.body;

  const tokenValidates = speakeasy.totp.verify({
    secret: secret,
    token: codigo,
    encoding: "base32",
    window: 6,
    time: 120,
  });

  if (tokenValidates) {
    res
      .status(200)
      .json(generarRespuesta(0, "Código validado correctamente.", null, null));
  } else {
    res.status(500).json(generarRespuesta(1, "Código invalido.", null, null));
  }
};

userCtrl.secondFactor = (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const { correo } = req.body;
  const code = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
    time: 120,
  });

  mailService
    .secondFactor(correo, code)
    .then(() => {
      res
        .status(200)
        .json(
          generarRespuesta(
            0,
            "Se envió correctamente un código a tu correo.",
            secret.base32,
            null
          )
        );
    })
    .catch((error) => {
      console.log("Ocurrió un error en el sistema.", error);
      res
        .status(200)
        .json(
          generarRespuesta(
            1,
            "Ocurrio un error al enviar el código.",
            null,
            null
          )
        );
    });
};

userCtrl.validarcorreo = (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const { correo } = req.body;
  const code = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
    time: 120,
  });

  mailService
    .validarcorreo(correo, code)
    .then(() => {
      res
        .status(200)
        .json(
          generarRespuesta(
            0,
            "Se envió correctamente un código a tu correo.",
            secret.base32,
            null
          )
        );
    })
    .catch((error) => {
      console.log("Ocurrió un error en el sistema.", error);
      res
        .status(200)
        .json(
          generarRespuesta(
            1,
            "Ocurrio un error al enviar el código.",
            null,
            null
          )
        );
    });
};

userCtrl.updateUserRoleToAdmin = async (user_id) => {
  try {
    const updateUserQuery = `
      UPDATE users
      SET role = 'Admin'
      WHERE id = $1
      RETURNING *;
    `;

    const updateUserValues = [user_id];

    const result = await pool.query(updateUserQuery, updateUserValues);

    if (result.rows.length === 0) {
      return { success: false, error: "Usuario no encontrado para actualizar el rol a Admin." };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

function generarRespuesta(estado, mensaje, objeto, token) {
  return {
    estado: estado,
    mensaje: mensaje,
    objeto: objeto,
    token: token,
  };
};

// Editar usuario
userCtrl.updateUser = async (req, res) => {
  try {
    const { id, username, email, role, razon_social, id_colaborador } = req.body;
    const updateUserQuery = `
      UPDATE users
      SET username = $1, email = $2, role = $3, razon_social = $4, id_colaborador = $5
      WHERE id = $6
      RETURNING *;
    `;
    const updateUserValues = [username, email, role, razon_social, id_colaborador, id];
    const result = await pool.query(updateUserQuery, updateUserValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario actualizado correctamente", user: result.rows[0] });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Ocurrió un error al intentar actualizar el usuario" });
  }
};

// Eliminar usuario
userCtrl.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUserQuery = `DELETE FROM users WHERE id = $1 RETURNING *;`;
    const deleteUserValues = [id];
    const result = await pool.query(deleteUserQuery, deleteUserValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Ocurrió un error al intentar eliminar el usuario" });
  }
};

function generarRespuesta(estado, mensaje, objeto, token) {
  return {
    estado: estado,
    mensaje: mensaje,
    objeto: objeto,
    token: token,
  };
};

module.exports = userCtrl;
