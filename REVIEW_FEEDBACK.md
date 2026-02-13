# 🚦 Code Review: Traffic Light - David Martínez

**Estudiante:** David Martínez  
**Proyecto:** Traffic Light (Semáforo Interactivo)  
**Cohort:** spain-fs-pt-129  
**Fecha de Revisión:** 2026-02-08

---

## 📊 Evaluación General

**Score Final: 83/100** ⚠️ **NECESITA MEJORAS**

---

## 🏗️ Análisis de Arquitectura y Estructura

### 1. Estructura de Componentes

**Evaluación:** ⭐⭐⭐⭐☆ (4/5)

#### ✅ Aspectos Positivos:

**Componente único y cohesivo:**
Tu componente `TrafficLight` tiene una responsabilidad clara: manejar la lógica y presentación del semáforo. Esta es una buena decisión de diseño para un proyecto de este tamaño.

```javascript
// TrafficLight.jsx - Componente bien definido
const TrafficLight = () => {
    const [color, setColor] = useState("red");
    const [purpleVisible, setPurpleVisible] = useState(false);
    // ...
};
```

**Punto de entrada limpio:**
El archivo `main.jsx` está bien estructurado, renderiza directamente el componente principal sin complejidad innecesaria.

#### ⚠️ Oportunidades de Mejora:

##### **Problema 1: Archivo `Home.jsx` sin uso**

**Ubicación:** `src/js/components/Home.jsx`

**Análisis:**
El componente `Home.jsx` existe en tu proyecto pero:
- No se importa en ningún archivo
- No se renderiza en ninguna parte
- Contiene código template del boilerplate
- Importa `rigoImage` que tampoco se usa

**Impacto:**
- ❌ Aumenta el tamaño del bundle innecesariamente
- ❌ Genera confusión sobre la estructura del proyecto
- ❌ Dificulta el mantenimiento (¿está activo o no?)
- ❌ Mala práctica: código muerto en producción

**Recomendación:**
```bash
# Eliminar el archivo completo
rm src/js/components/Home.jsx

# También eliminar la imagen no utilizada
rm src/img/rigo-baby.jpg
```

**Alternativa (si quieres usarlo):**
Si tienes planes de usar este componente, deberías integrarlo en tu aplicación:

```javascript
// main.jsx
import Home from './components/Home';
import TrafficLight from './components/TrafficLight';

root.render(
  <React.StrictMode>
    <Home />
    <TrafficLight />
  </React.StrictMode>
);
```

**Criterio afectado:** Limpieza de código y estructura del proyecto  
**Descuento:** -3 puntos

---

### 2. Gestión del Estado

**Evaluación:** ⭐⭐⭐⭐⭐ (5/5)

#### ✅ Uso Excelente de useState:

```javascript
const [color, setColor] = useState("red");
const [purpleVisible, setPurpleVisible] = useState(false);
```

**Aspectos excepcionales:**

1. **Estado mínimo necesario** ✅
   - Solo 2 estados, exactamente lo que necesitas
   - No hay estado redundante o derivado innecesario
   - Sigues el principio de "mínima cantidad de estado"

2. **Nomenclatura clara y descriptiva** ✅
   - `color` → obvio que controla el color activo
   - `purpleVisible` → específico sobre qué controla
   - Sigues la convención `[value, setValue]` de React

3. **Separación apropiada de concerns** ✅
   - El estado del color es independiente de la visibilidad de púrpura
   - Permite modificar cada aspecto sin afectar al otro
   - Facilita el mantenimiento y testing

4. **Inicialización sensata** ✅
   - `"red"` es un buen valor inicial (color típico de inicio en semáforos)
   - `false` para purpleVisible (feature desactivada por defecto)

**Patrón identificado:** ✅ **Estado mínimo** - Este es exactamente el patrón correcto en React. ¡Excelente trabajo!

**Sin descuentos en esta área** ✅

---

### 3. Lógica de Negocio

**Evaluación:** ⭐⭐⭐☆☆ (3/5)

#### ✅ Función `cycleColor` bien estructurada:

```javascript
const cycleColor = () => {
    if (color === "red") setColor("green");
    else if (color === "green") setColor("yellow");
    else if (color === "yellow") setColor("red");
};
```

**Aspectos positivos:**
- Lógica clara y fácil de seguir
- Función extraída apropiadamente (no está inline en el JSX)
- No modifica estado directamente (usa setColor)

#### ⚠️ Problema Crítico: Lógica incompleta con casos edge

##### **Bug 1: Púrpura no se incluye en el ciclo**

**Escenario problemático:**

1. Usuario añade luz púrpura (botón "Añadir Púrpura")
2. Usuario hace click en la luz púrpura (se activa, `color = "purple"`)
3. Usuario presiona botón "Alternar Color"
4. **Resultado:** Nada pasa ❌

**¿Por qué?**
Tu función `cycleColor` solo contempla red, green, yellow:

```javascript
if (color === "red") setColor("green");
else if (color === "green") setColor("yellow");
else if (color === "yellow") setColor("red");
// Si color === "purple", ninguna condición se cumple → no hace nada
```

**Impacto en UX:**
- Usuario confundido: presiona botón y no pasa nada
- Comportamiento inconsistente e inesperado
- Necesita hacer click manual en otra luz para salir del estado púrpura

**Solución propuesta:**

```javascript
const cycleColor = () => {
    // Definir colores base del ciclo
    const baseColors = ["red", "green", "yellow"];
    
    // Si púrpura está visible, incluirla en el ciclo
    const colors = purpleVisible ? [...baseColors, "purple"] : baseColors;
    
    // Encontrar índice actual y ciclar al siguiente
    const currentIndex = colors.indexOf(color);
    const nextIndex = (currentIndex + 1) % colors.length;
    
    setColor(colors[nextIndex]);
};
```

**Beneficios de esta solución:**
- ✅ Maneja **todos** los casos (incluyendo púrpura)
- ✅ Más escalable (fácil añadir más colores en el futuro)
- ✅ Elimina lógica condicional repetitiva
- ✅ Comportamiento predecible y consistente
- ✅ Usa programación funcional (indexOf, módulo)

**Criterio afectado:** Lógica de negocio y casos edge  
**Descuento:** -5 puntos

---

### 4. Estructura del JSX

**Evaluación:** ⭐⭐⭐☆☆ (3/5)

#### ⚠️ Problema 1: Concatenación de strings en className

**Código actual (líneas 20, 24, 28, 34):**
```javascript
className={"light red" + (color === "red" ? " glow" : "")}
className={"light yellow" + (color === "yellow" ? " glow" : "")}
className={"light green" + (color === "green" ? " glow" : "")}
className={"light purple" + (color === "purple" ? " glow" : "")}
```

**Problemas identificados:**

1. **Legibilidad pobre** 
   - Difícil distinguir dónde empieza/termina cada string
   - El espacio antes de "glow" no es obvio

2. **Propenso a errores**
   - Fácil olvidar el espacio: `"light red" + "glow"` → `"light redglow"` ❌
   - Con múltiples clases condicionales se vuelve inmanejable

3. **No escala bien**
   - ¿Qué pasa si necesitas 3 o 4 clases condicionales?
   - La expresión se vuelve muy larga y confusa

**Solución 1: Template Literals (Recomendado para este caso)**

```javascript
className={`light red ${color === "red" ? "glow" : ""}`}
className={`light yellow ${color === "yellow" ? "glow" : ""}`}
className={`light green ${color === "green" ? "glow" : ""}`}
className={`light purple ${color === "purple" ? "glow" : ""}`}
```

**Beneficios:**
- ✅ Más legible (se ve claramente el espacio)
- ✅ Sintaxis moderna de JavaScript (ES6+)
- ✅ Patrón estándar en React

**Solución 2: Librería `classnames` (Profesional para casos complejos)**

```javascript
import classNames from 'classnames';

// En el JSX
className={classNames('light', 'red', { 'glow': color === 'red' })}
className={classNames('light', 'yellow', { 'glow': color === 'yellow' })}
```

**Beneficios:**
- ✅ Muy legible
- ✅ Maneja arrays, objetos, condiciones complejas
- ✅ Estándar de la industria
- ✅ Evita clases vacías o espacios extra

**Criterio afectado:** Calidad del JSX y mejores prácticas  
**Descuento:** -3 puntos

---

#### ⚠️ Problema 2: Estilos inline en lugar de clases CSS

**Código actual (línea 15):**
```javascript
<div className="bg-black" style={{ width: "10px", height: "50px" }}></div>
```

**¿Por qué es problemático?**

1. **Viola separación de concerns**
   - Mezcla lógica de presentación (CSS) con lógica de componente (React)
   - Dificulta mantener consistencia visual

2. **No es reutilizable**
   - Si necesitas otro "poste" en otro componente, tienes que duplicar el style object

3. **Performance menor**
   - Estilos inline no se cachean como CSS externo
   - React tiene que procesar el objeto en cada render

4. **Dificulta mantenimiento**
   - Para cambiar el ancho del poste, tienes que buscar en el JSX
   - En CSS estaría centralizado

**Solución propuesta:**

```css
/* En index.css */
.traffic-light-pole {
    background-color: black;
    width: 10px;
    height: 50px;
}
```

```javascript
// En TrafficLight.jsx
<div className="traffic-light-pole"></div>
```

**Beneficios:**
- ✅ Separación de concerns (CSS separado de lógica)
- ✅ Reutilizable en otros componentes
- ✅ CSS cacheable por el navegador
- ✅ Más fácil de mantener y modificar
- ✅ Mejora legibilidad del JSX

**Nota:** Los estilos inline **son apropiados** cuando:
- El estilo depende de props/estado dinámico
- Animaciones programáticas
- Valores calculados en runtime

En tu caso, el poste siempre mide 10px x 50px → debe ser CSS.

**Criterio afectado:** Separación de concerns y mantenibilidad  
**Descuento:** -2 puntos

---

#### ✅ Aspectos Positivos del JSX:

1. **Renderizado condicional correcto:**
```javascript
{purpleVisible && (
    <div onClick={() => setColor("purple")}
         className={"light purple" + (color === "purple" ? " glow" : "")}>
    </div>
)}
```
- Usas el patrón `&&` apropiadamente
- El componente se monta/desmonta correctamente

2. **Estructura visual clara:**
- El JSX está bien indentado
- Es fácil ver la jerarquía de elementos

3. **Bootstrap bien integrado:**
- Usas clases de Bootstrap apropiadamente (`d-flex`, `flex-column`, `gap-3`)

---

### 5. Manejo de Eventos

**Evaluación:** ⭐⭐⭐☆☆ (3/5)

#### ⚠️ Problema: Arrow functions inline en event handlers

**Código actual (líneas 19, 23, 27, 33, 43):**
```javascript
onClick={() => setColor("red")}
onClick={() => setColor("yellow")}
onClick={() => setColor("green")}
onClick={() => setColor("purple")}
onClick={() => setPurpleVisible(!purpleVisible)}
```

**¿Por qué puede ser problemático?**

En componentes más complejos, esto puede causar:
- Re-creación de funciones en cada render
- Re-renders innecesarios si pasas estas funciones como props
- Problemas de performance en listas grandes

**Contexto:** Para tu proyecto actual (componente pequeño, pocas luces), esto **NO** es un problema real de performance. Sin embargo, es bueno conocer la alternativa para proyectos más grandes.

**Alternativa con useCallback (para referencia futura):**

```javascript
const TrafficLight = () => {
    const [color, setColor] = useState("red");
    const [purpleVisible, setPurpleVisible] = useState(false);
    
    // Memoizar handlers
    const handleRedClick = useCallback(() => setColor("red"), []);
    const handleYellowClick = useCallback(() => setColor("yellow"), []);
    const handleGreenClick = useCallback(() => setColor("green"), []);
    const handlePurpleClick = useCallback(() => setColor("purple"), []);
    const togglePurple = useCallback(() => setPurpleVisible(prev => !prev), []);
    
    return (
        <div className="container-fluid...">
            <div onClick={handleRedClick} className={...}>
            </div>
            <div onClick={handleYellowClick} className={...}>
            </div>
            {/* ... */}
        </div>
    );
};
```

**Beneficios de useCallback:**
- ✅ Funciones estables (misma referencia entre renders)
- ✅ Evita re-renders innecesarios en componentes hijo
- ✅ Mejor para performance en apps grandes

**Cuándo NO usarlo:**
- ❌ Componentes pequeños como el tuyo (over-engineering)
- ❌ No hay componentes hijo que dependan de estas funciones
- ❌ No hay problemas de performance medibles

**Veredicto para tu proyecto:**
Tu enfoque actual es **aceptable** para este tamaño de aplicación. No es necesario optimizar a menos que midas problemas de performance reales.

**Sin descuento** (porque es apropiado para el contexto) ✅

---

### 6. Performance y Optimización

**Evaluación:** ⭐⭐⭐⭐⭐ (5/5)

#### ✅ No hay problemas significativos de performance

**Análisis:**

1. **Componente pequeño**
   - Re-renders son baratos
   - No hay cálculos costosos
   - Render tree es shallow

2. **Estado optimizado**
   - Mínimo estado necesario
   - No hay estado derivado calculándose en cada render

3. **No hay operaciones pesadas**
   - No hay loops complejos
   - No hay transformaciones de datos grandes
   - No hay llamadas a APIs

4. **DOM manipulations mínimas**
   - Solo cambios de clases CSS
   - React maneja eficientemente los updates

**Conclusión:**
Para un componente de este tamaño, optimizaciones como `useMemo`, `useCallback`, o `React.memo` serían **over-engineering**. Tu código tiene la performance adecuada.

**Sin descuentos** ✅

---

### 7. Organización de Archivos y CSS

**Evaluación:** ⭐⭐⭐☆☆ (3/5)

#### ✅ Aspectos Positivos:

1. **Separación de estilos en archivo CSS**
   ```
   src/styles/index.css ← Estilos centralizados
   ```

2. **Nombres de clases descriptivos:**
   ```css
   .light { /* ... */ }
   .glow { /* ... */ }
   .red, .yellow, .green, .purple { /* ... */ }
   ```

3. **CSS bien organizado:**
   - Estilos del body primero
   - Clases de componentes después
   - Lógica visual clara

#### ⚠️ Problemas Identificados:

##### **Problema 1: Archivo `Home.jsx` sin uso** (ya mencionado arriba)
**Descuento:** -3 puntos

##### **Problema 2: Clase CSS `.traffic-body` sin uso**

**Ubicación:** `src/styles/index.css` (líneas 30-34)

```css
.traffic-body {
    background-color: black;
    padding: 10px;
    border-radius: 15px;
}
```

**Análisis:**
- Esta clase no se usa en ningún componente
- Probablemente fue un intento inicial de diseño
- Código muerto en el CSS

**Recomendación:**
```css
/* Eliminar esta clase */
/* .traffic-body { ... } */
```

**Criterio afectado:** Limpieza de código  
**Descuento:** -1 punto

---

### 8. Documentación y Comentarios

**Evaluación:** ⭐⭐☆☆☆ (2/5)

#### ⚠️ Problema: Falta documentación en el código

**Código actual:**
```javascript
import React, { useState } from "react";

const TrafficLight = () => {
    const [color, setColor] = useState("red");
    const [purpleVisible, setPurpleVisible] = useState(false);
    const cycleColor = () => {
        if (color === "red") setColor("green");
        else if (color === "green") setColor("yellow");
        else if (color === "yellow") setColor("red");
    };
    // ...
```

**Problemas:**
- No hay comentarios JSDoc
- No hay descripción del componente
- No está claro qué hace cada función
- Falta contexto para futuros mantenedores

**Solución propuesta:**

```javascript
import React, { useState } from "react";

/**
 * TrafficLight - Componente de semáforo interactivo
 * 
 * Características:
 * - 3 luces básicas (rojo, amarillo, verde)
 * - Click en cada luz para activarla
 * - Botón para ciclar automáticamente entre colores
 * - Funcionalidad bonus: luz púrpura opcional
 * 
 * @returns {JSX.Element} Semáforo interactivo
 */
const TrafficLight = () => {
    // Estado que controla qué color está activo
    const [color, setColor] = useState("red");
    
    // Estado que controla si la luz púrpura está visible
    const [purpleVisible, setPurpleVisible] = useState(false);
    
    /**
     * Cicla automáticamente entre los colores del semáforo
     * Orden: rojo → verde → amarillo → rojo
     */
    const cycleColor = () => {
        if (color === "red") setColor("green");
        else if (color === "green") setColor("yellow");
        else if (color === "yellow") setColor("red");
    };
    
    return (
        <div className="container-fluid d-flex flex-column align-items-center mt-5">
            {/* Poste del semáforo */}
            <div className="bg-black" style={{ width: "10px", height: "50px" }}></div>
            
            {/* Cuerpo del semáforo con las luces */}
            <div className="bg-black p-3 rounded-3 d-flex flex-column gap-3 shadow-lg">
                {/* Luz Roja */}
                <div 
                    onClick={() => setColor("red")}
                    className={"light red" + (color === "red" ? " glow" : "")}>
                </div>
                
                {/* Luz Amarilla */}
                <div 
                    onClick={() => setColor("yellow")}
                    className={"light yellow" + (color === "yellow" ? " glow" : "")}>
                </div>
                
                {/* Luz Verde */}
                <div 
                    onClick={() => setColor("green")}
                    className={"light green" + (color === "green" ? " glow" : "")}>
                </div>
                
                {/* Luz Púrpura (bonus) - Solo visible si se activa */}
                {purpleVisible && (
                    <div 
                        onClick={() => setColor("purple")}
                        className={"light purple" + (color === "purple" ? " glow" : "")}>
                    </div>
                )}
            </div>

            {/* Botones de control */}
            <div className="mt-5 d-flex gap-2">
                <button className="btn btn-primary" onClick={cycleColor}>
                    Alternar Color
                </button>
                <button className="btn btn-info" onClick={() => setPurpleVisible(!purpleVisible)}>
                    {purpleVisible ? "Quitar Púrpura" : "Añadir Púrpura"}
                </button>
            </div>
        </div>
    );
};

export default TrafficLight;
```

**Beneficios de la documentación:**
- ✅ Otros desarrolladores entienden rápidamente el código
- ✅ Tú mismo entiendes tu código 6 meses después
- ✅ Facilita onboarding de nuevos miembros del equipo
- ✅ Es una práctica profesional estándar

**Criterio afectado:** Código limpio y mantenibilidad  
**Descuento:** -3 puntos

---

## 📊 Evaluación Detallada con Criterios Técnicos

| Criterio | Puntos | Obtenido | Comentario |
|----------|--------|----------|------------|
| **Funcionalidad Básica** | 25 | 25 | ✅ Todas las funcionalidades funcionan correctamente |
| **Arquitectura y Estructura** | 15 | 12 | ⚠️ Archivo Home.jsx sin uso (-3) |
| **Gestión del Estado** | 15 | 15 | ✅ Excelente uso de useState |
| **Lógica de Negocio** | 15 | 10 | ⚠️ cycleColor no maneja púrpura (-5) |
| **Calidad del JSX** | 10 | 5 | ⚠️ Concatenación strings (-3), estilos inline (-2) |
| **Manejo de Eventos** | 5 | 5 | ✅ Apropiado para el tamaño del proyecto |
| **CSS y Estilos** | 5 | 4 | ⚠️ Clase .traffic-body sin uso (-1) |
| **Documentación** | 10 | 7 | ⚠️ Falta comentarios y JSDoc (-3) |
| **Bonus (Púrpura)** | +10 | +10 | 🌟 Funcionalidad extra implementada |
| **TOTAL** | **100** | **83** | ⚠️ **NECESITA MEJORAS** |

---

## 📋 Resumen de Puntos Perdidos

### Descuentos Totales: -17 puntos

1. **-3 puntos** - Archivo `Home.jsx` sin uso (código muerto)
2. **-5 puntos** - Función `cycleColor` no maneja el caso de púrpura (bug)
3. **-3 puntos** - Concatenación de strings en className (mala práctica)
4. **-2 puntos** - Estilos inline en lugar de clase CSS
5. **-1 punto** - Clase CSS `.traffic-body` sin uso
6. **-3 puntos** - Falta documentación JSDoc y comentarios

---

## 🎯 Cómo Llegar a 100/100

Aplicando las correcciones sugeridas en este PR:

### 1. ✅ Eliminar código muerto (+3 puntos)
```bash
rm src/js/components/Home.jsx
```

Y eliminar de `index.css`:
```css
/* Eliminar líneas 30-34 */
```

### 2. ✅ Mejorar función cycleColor (+5 puntos)
```javascript
const cycleColor = () => {
    const baseColors = ["red", "green", "yellow"];
    const colors = purpleVisible ? [...baseColors, "purple"] : baseColors;
    const currentIndex = colors.indexOf(color);
    const nextIndex = (currentIndex + 1) % colors.length;
    setColor(colors[nextIndex]);
};
```

### 3. ✅ Usar template literals en className (+3 puntos)
```javascript
className={`light red ${color === "red" ? "glow" : ""}`}
```

### 4. ✅ Crear clase CSS para el poste (+2 puntos)
```css
.traffic-light-pole {
    background-color: black;
    width: 10px;
    height: 50px;
}
```

```javascript
<div className="traffic-light-pole"></div>
```

### 5. ✅ Añadir documentación completa (+4 puntos)
- JSDoc en el componente
- Comentarios en el estado
- Comentarios en funciones importantes
- Comentarios en JSX para claridad

**= 100/100** 🎉

---

## 🎓 Conceptos Clave Aprendidos

### 1. Estado Mínimo en React ✅
```javascript
// ✅ BIEN - Estado mínimo necesario
const [color, setColor] = useState("red");
const [purpleVisible, setPurpleVisible] = useState(false);

// ❌ MAL - Estado derivado innecesario
const [color, setColor] = useState("red");
const [isRed, setIsRed] = useState(true); // ← innecesario, se puede calcular
const [isYellow, setIsYellow] = useState(false); // ← innecesario
```

### 2. Manejo de Casos Edge ⚠️
Siempre considera:
- ¿Qué pasa en estados inesperados?
- ¿Qué pasa si el usuario hace algo fuera de orden?
- ¿Todos los valores posibles están manejados?

### 3. Separación de Concerns 🏗️
```javascript
// ❌ MAL - CSS mezclado con lógica
<div style={{ width: "10px", height: "50px" }}></div>

// ✅ BIEN - CSS separado
<div className="traffic-light-pole"></div>
```

### 4. Código Limpio = Código sin Uso Eliminado 🧹
- Archivos sin importar → eliminar
- Clases CSS sin usar → eliminar
- Código comentado → eliminar
- Imports no usados → eliminar

---

## 💡 Recomendaciones para Futuros Proyectos

### Antes de entregar SIEMPRE:

1. **Revisar archivos sin uso**
   ```bash
   # Buscar imports no usados
   npm run lint
   ```

2. **Probar casos edge**
   - ¿Qué pasa si...?
   - Usuario hace clicks rápidos
   - Estados inesperados

3. **Añadir documentación básica**
   - JSDoc en componentes
   - Comentarios en lógica compleja

4. **Consistencia en convenciones**
   - Template literals en todo el proyecto
   - Nombres descriptivos
   - Estructura uniforme

### Ideas para Expandir Este Proyecto (Opcional):

1. **Temporizador automático**
   ```javascript
   const [isAuto, setIsAuto] = useState(false);
   
   useEffect(() => {
       if (isAuto) {
           const interval = setInterval(cycleColor, 2000);
           return () => clearInterval(interval);
       }
   }, [isAuto, cycleColor]);
   ```

2. **Contador de clicks por luz**
   ```javascript
   const [clickCounts, setClickCounts] = useState({
       red: 0, yellow: 0, green: 0, purple: 0
   });
   ```

3. **Sonidos al cambiar de luz**
   ```javascript
   const playSound = (color) => {
       const audio = new Audio(`/sounds/${color}.mp3`);
       audio.play();
   };
   ```

---

## 📚 Recursos Recomendados

### Para Profundizar:

1. **React Docs - useState**  
   https://react.dev/reference/react/useState  
   Guía oficial sobre manejo de estado

2. **Clean Code JavaScript**  
   https://github.com/ryanmcdermott/clean-code-javascript  
   Mejores prácticas de JavaScript

3. **Template Literals (MDN)**  
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals  
   Sintaxis moderna de strings

4. **React Thinking in Components**  
   https://react.dev/learn/thinking-in-react  
   Cómo estructurar aplicaciones React

---

## ✅ Veredicto Final

**Score: 83/100** ⚠️ **NECESITA MEJORAS MENORES**

### Lo que hiciste MUY bien:

1. ✅ **Funcionalidad completa** - Todo funciona correctamente
2. ✅ **Estado óptimo** - Usas useState de forma ejemplar
3. ✅ **Bonus implementado** - La luz púrpura es un gran extra
4. ✅ **Estilos atractivos** - Efecto glow y diseño visual

### Lo que debes mejorar:

1. ⚠️ **Eliminar código muerto** (Home.jsx, .traffic-body)
2. ⚠️ **Completar lógica** (cycleColor debe manejar púrpura)
3. ⚠️ **Modernizar sintaxis** (template literals en className)
4. ⚠️ **Añadir documentación** (JSDoc y comentarios)

### Mensaje Final:

**¡Buen trabajo, David!** 🎉

Tu semáforo funciona correctamente y demuestra buen entendimiento de React y manejo de estado. Los problemas identificados son **menores y fáciles de corregir**. 

Las mejoras sugeridas te ayudarán a:
- Escribir código más profesional
- Evitar bugs en casos edge
- Facilitar mantenimiento futuro
- Seguir mejores prácticas de la industria

Los cambios en este Pull Request son **educativos** y muestran cómo mejorar tu código. Revísalos con atención y aplica estos patrones en tus próximos proyectos.

**¡Sigue así! Vas por buen camino.** 🚀

---

*Revisión realizada por: Profesor Erwin Aguero*  
*Fecha: 2026-02-08*  
*Cohort: spain-fs-pt-129*  
*Tipo: Revisión Técnica Profunda*
