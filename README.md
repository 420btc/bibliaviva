# 📖 Biblia Viva App

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai)

**Biblia Viva App** es una aplicación moderna y completa diseñada para enriquecer tu experiencia de estudio y lectura bíblica. Combina una interfaz elegante con poderosas herramientas de IA, gamificación y funciones sociales para ayudarte a profundizar en las Escrituras diariamente.

## ✨ Características Principales

### 📚 Estudio Bíblico
- **Lector Interactivo:** Interfaz limpia y personalizable para la lectura de la Biblia.
- **Explorador de Temas:** Encuentra versículos relacionados con emociones o situaciones específicas.
- **Notas Personales:** Guarda tus reflexiones y pensamientos sobre pasajes específicos.

### 🤖 Inteligencia Artificial
- **Chat Bíblico AI:** Un asistente inteligente para responder tus dudas teológicas y guiarte en tu estudio.
- **Generación de Audio:** Escucha versículos con voces naturales (integración con OpenAI).

### 🎮 Gamificación
- **Logros y Medallas:** Desbloquea recompensas por tu constancia y lectura.
- **Desafíos Diarios:** Retos nuevos cada día para mantenerte motivado.
- **Quiz Bíblico:** Pon a prueba tus conocimientos con trivias diarias.
- **Tabla de Clasificación:** Compite amistosamente con otros usuarios.

### 🤝 Comunidad y Espiritualidad
- **Muro de Oraciones:** Comparte tus peticiones y ora por otros.
- **Grupos:** Únete a comunidades de estudio.
- **Planes de Lectura:** Sigue guías estructuradas para leer la Biblia en un año, por temas, etc.

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza las últimas tecnologías del desarrollo web moderno:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/) & [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Componentes UI:** [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Validación:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **IA:** [OpenAI SDK](https://platform.openai.com/docs/libraries/node-js-library)

## 🚀 Comenzando

Sigue estos pasos para configurar el proyecto localmente.

### Prerrequisitos
- Node.js (versión 18 o superior recomendada)
- npm, pnpm o yarn

### Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/biblia-viva-app.git
    cd biblia-viva-app
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o
    pnpm install
    # o
    yarn install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tus claves API necesarias (ej. OpenAI).
    ```env
    OPENAI_API_KEY=tu_clave_api_aqui
    ```

4.  **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📂 Estructura del Proyecto

```
biblia-viva-app/
├── app/                  # Rutas y páginas de Next.js (App Router)
│   ├── biblia/           # Lector de la Biblia
│   ├── chat/             # Chat con IA
│   ├── explorador/       # Explorador de temas
│   ├── ...               # Otras secciones (grupos, logros, etc.)
├── components/           # Componentes de React reutilizables
│   ├── bible/            # Componentes específicos del lector
│   ├── chat/             # Componentes del chat
│   ├── dashboard/        # Widgets del panel principal
│   ├── ui/               # Componentes base (botones, inputs, etc.)
├── lib/                  # Utilidades y funciones auxiliares
│   ├── bible-api.ts      # Cliente de la API de la Biblia
│   ├── openai-actions.ts # Acciones de servidor para OpenAI
│   └── gamification.ts   # Lógica de gamificación
├── hooks/                # Hooks personalizados de React
└── public/               # Archivos estáticos
```

## 🎨 Personalización

El proyecto utiliza variables CSS para los temas, permitiendo cambiar fácilmente entre modo claro y oscuro, así como ajustar la paleta de colores principal en `globals.css`.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

Hecho con ❤️ para la edificación espiritual.
