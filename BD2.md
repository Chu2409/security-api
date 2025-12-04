# Seguridad de Datos en PostgreSQL y SQL Server

Guía de comandos para enmascaramiento, cifrado y protección de datos.

---

## 1. PostgreSQL – Encriptación y Enmascaramiento

PostgreSQL no incluye enmascaramiento nativo, pero permite cifrado mediante la extensión `pgcrypto`.

### 1.1 Habilitar la extensión pgcrypto

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### 1.2 Encriptación con `crypt()` (bcrypt)

#### Cifrar contraseñas existentes

```sql
UPDATE usuarios
SET password = crypt(password, gen_salt('bf'));
```

#### Insertar datos ya cifrados

```sql
INSERT INTO usuarios (nombre, username, password, correo)
VALUES ('Test', 'test', crypt('secret123', gen_salt('bf')), 'test@example.com');
```

#### Verificar contraseña

```sql
SELECT * FROM usuarios
WHERE password = crypt('secret123', password);
```

### 1.3 Encriptación simétrica AES (pgcrypto)

#### Cifrar

```sql
UPDATE usuarios
SET correo = encode(
    encrypt(correo, 'mi_clave_secreta', 'aes'),
    'hex'
);
```

#### Desencriptar

```sql
SELECT
  convert_from(
    decrypt(decode(correo, 'hex'), 'mi_clave_secreta', 'aes'),
  'UTF8') AS correo
FROM usuarios;
```

### 1.4 Enmascaramiento manual

```sql
SELECT
  left(correo, 3) || '****@****' AS correo_mascarado
FROM usuarios;
```

---

## 2. SQL Server – Enmascaramiento y Cifrado

SQL Server ofrece Dynamic Data Masking y Always Encrypted.

### 2.1 Dynamic Data Masking

#### Enmascarar nombre

```sql
ALTER TABLE productos
ALTER COLUMN nombre ADD MASKED WITH (FUNCTION = 'partial(2,"****",2)');
```

#### Enmascarar precio

```sql
ALTER TABLE productos
ALTER COLUMN precio ADD MASKED WITH (FUNCTION = 'default()');
```

#### Enmascarar stock

```sql
ALTER TABLE productos
ALTER COLUMN stock ADD MASKED WITH (FUNCTION = 'random(1,100)');
```

#### Quitar máscara

```sql
ALTER TABLE productos
ALTER COLUMN precio DROP MASKED;
```

### 2.2 Always Encrypted

#### Crear clave maestra

```sql
CREATE COLUMN MASTER KEY MyCMK
WITH (
  KEY_STORE_PROVIDER_NAME = 'MSSQL_CERTIFICATE_STORE',
  KEY_PATH = 'CurrentUser/My/CertName'
);
```

#### Crear clave de cifrado

```sql
CREATE COLUMN ENCRYPTION KEY MyCEK
WITH VALUES (
  COLUMN_MASTER_KEY = MyCMK,
  ALGORITHM = 'RSA_OAEP',
  ENCRYPTED_VALUE = <valor_encriptado>
);
```

#### Cifrar columna existente

```sql
ALTER TABLE productos
ALTER COLUMN nombre
NVARCHAR(100)
ENCRYPTED WITH (
    COLUMN_ENCRYPTION_KEY = MyCEK,
    ENCRYPTION_TYPE = DETERMINISTIC,
    ALGORITHM = 'AEAD_AES_256_CBC_HMAC_SHA_256'
);
```

### 2.3 Enmascaramiento manual

```sql
SELECT CONCAT(LEFT(nombre, 2), '****') AS nombre_mascarado
FROM productos;
```

---

## 3. Escenarios prácticos de Enmascaramiento y Encriptación

A continuación, se presentan escenarios reales donde puede aplicarse cada técnica.

### 3.1 Escenario: Protección de contraseñas en PostgreSQL

Un sistema CRUD de usuarios no debe almacenar contraseñas en texto plano.

- **Solución:** usar `crypt()` con bcrypt.
- **Evita:** que un atacante que robe la base vea las contraseñas.

### 3.2 Escenario: Proteger correos o datos sensibles

Cuando un rol con permisos limitados consulta registros pero no debe ver correos completos.

- **Solución:**
  - Enmascaramiento manual (para roles de lectura)
  - Cifrado AES si se requiere recuperar valor original

### 3.3 Escenario: Consultas desde un servicio externo

Un analista puede ejecutar consultas, pero no debe ver datos críticos.

- **Solución:** crear usuario con permisos limitados, vistas enmascaradas.

```sql
CREATE VIEW usuarios_masked AS
SELECT id, nombre, left(correo, 3) || '****@****' AS correo
FROM usuarios;

GRANT SELECT ON usuarios_masked TO analista;
```

---

## 4. Gestión de Usuarios y Permisos

### 4.1 PostgreSQL – Creación de usuarios y permisos

#### Crear usuario de solo lectura

```sql
CREATE USER analista WITH PASSWORD 'analista123';
GRANT CONNECT ON DATABASE mydb TO analista;
GRANT USAGE ON SCHEMA public TO analista;
GRANT SELECT ON usuarios TO analista;
```

#### Evitar acceso a columnas sensibles

```sql
REVOKE SELECT (password) ON usuarios FROM analista;
```

#### Alternativa: solo permitir vista enmascarada

```sql
GRANT SELECT ON usuarios_masked TO analista;
```

---

### 4.2 SQL Server – Creación de usuarios y permisos

#### Crear usuario y asignar permisos básicos

```sql
CREATE LOGIN analista WITH PASSWORD = 'Analista123!';
USE mydb;
CREATE USER analista FOR LOGIN analista;
GRANT SELECT ON productos TO analista;
```

#### Bloquear columnas confidenciales

```sql
DENY SELECT ON OBJECT::productos(nombre) TO analista;
```

> Nota: Si usas Dynamic Data Masking, SQL Server aplicará automáticamente la máscara al usuario sin privilegios de UNMASK.

#### Asignar permiso UNMASK (si se requiere ver datos reales)

```sql
GRANT UNMASK TO analista;
```

---

## 5. Resumen rápido

| Motor      | Método recomendado               | Comando clave         |
| ---------- | -------------------------------- | --------------------- |
| PostgreSQL | bcrypt para contraseñas          | `crypt(...)`          |
| PostgreSQL | AES si necesitas recuperar datos | `encrypt()/decrypt()` |
| SQL Server | Enmascaramiento rápido           | `ADD MASKED`          |
| SQL Server | Cifrado real                     | Always Encrypted      |

---
