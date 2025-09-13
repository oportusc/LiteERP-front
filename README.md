# Frutos Secos - Frontend

Frontend de la aplicación Frutos Secos desarrollado con React, TypeScript, Vite y Tailwind CSS.

## 🚀 Características

- **React 18** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **Tailwind CSS** para estilos
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Context API** para manejo de estado de autenticación
- **JWT** para autenticación

## 📦 Instalación

```bash
# Instalar dependencias
yarn install

# Ejecutar en modo desarrollo
yarn dev

# Construir para producción
yarn build

# Preview de la build de producción
yarn preview
```

## 🔧 Configuración

El frontend se conecta automáticamente al backend en `http://localhost:3000`. Asegúrate de que el backend esté ejecutándose antes de iniciar el frontend.

## 📱 Funcionalidades

### Autenticación
- **Registro de usuarios**: Formulario para crear nuevas cuentas
- **Login**: Inicio de sesión con email y contraseña
- **Dashboard protegido**: Área privada solo para usuarios autenticados
- **Logout**: Cerrar sesión y limpiar tokens

### Navegación
- Rutas protegidas que redirigen a login si no hay autenticación
- Redirección automática al dashboard después del login/registro
- Navegación fluida entre componentes

## 🎨 Diseño

- Interfaz moderna y responsive con Tailwind CSS
- Formularios con validación visual
- Estados de carga y manejo de errores
- Diseño centrado en la experiencia del usuario

## 🔗 Conexión con Backend

El frontend se conecta con los siguientes endpoints del backend:

- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión
- `GET /auth/profile` - Obtener perfil del usuario

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Login.tsx       # Formulario de login
│   ├── Register.tsx    # Formulario de registro
│   ├── Dashboard.tsx   # Panel principal
│   ├── Loading.tsx     # Componente de carga
│   └── ProtectedRoute.tsx # Ruta protegida
├── contexts/           # Contextos de React
│   └── AuthContext.tsx # Contexto de autenticación
├── services/           # Servicios
│   └── api.ts         # Cliente HTTP y servicios API
├── types/             # Tipos TypeScript
│   └── auth.ts        # Tipos de autenticación
├── App.tsx            # Componente principal
└── main.tsx           # Punto de entrada
```

## 🧪 Pruebas

Para probar la aplicación:

1. Asegúrate de que el backend esté ejecutándose en el puerto 3000
2. Ejecuta `yarn dev` en el frontend
3. Navega a `http://localhost:5173`
4. Prueba el registro de un nuevo usuario
5. Inicia sesión con las credenciales creadas
6. Verifica que el dashboard muestre la información del usuario

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Context API** - Manejo de estado