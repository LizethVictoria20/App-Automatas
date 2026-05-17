# Ejercicio 12: Computabilidad del Busy Beaver

## 📚 Descripción

El **Busy Beaver Problem** es uno de los problemas más fascinantes en teoría de la computación. Se pregunta: 

> Entre todas las máquinas de Turing con n estados y k símbolos que eventualmente se detienen, ¿cuál deja el máximo número de símbolos no-blancos en la cinta?

## 🔢 Fórmula: Número de Máquinas de Turing Posibles

Para máquinas con **n estados** y **k símbolos**:

```
Total de máquinas posibles = (2k(n+1))^(nk)
```

### Explicación:
- **n** = número de estados (sin contar el estado halt)
- **k** = número de símbolos disponibles
- Cada instrucción de TM especifica:
  1. **Símbolo a escribir**: k opciones
  2. **Dirección de movimiento**: 2 opciones (L/R)
  3. **Estado siguiente**: (n+1) opciones (n estados + halt)
- **Total de instrucciones necesarias**: n × k (una por cada estado-símbolo)
- **Combinaciones totales**: 2k(n+1) opciones por instrucción
- **Total de máquinas**: (2k(n+1))^(nk)

## 📊 Ejemplos

### Para 3 estados y 2 símbolos:
```
(2 × 2 × (3+1))^(3×2) = (2 × 2 × 4)^6 = 16^6 = 16,777,216
```
Existen **más de 16 millones** de máquinas de Turing diferentes con 3 estados y 2 símbolos.

### Para 2 estados y 2 símbolos:
```
(2 × 2 × (2+1))^(2×2) = (2 × 2 × 3)^4 = 12^4 = 20,736
```

## 🎯 Busy Beaver Conocidos

| Estados | Símbolos | Pasos | Símbolos Escritos |
|---------|----------|-------|-------------------|
| 2       | 2        | 6     | 4                 |
| 3       | 2        | 21    | 6                 |
| 4       | 2        | 107   | 13                |
| 5       | 2        | 47,176,870 | 4,098 |

## 🚀 Cómo Usar el Ejercicio 12

1. En la app, selecciona **"Ejercicio 12: Busy Beaver 21 Pasos"**
2. Presiona **Play** para ejecutar la máquina
3. Observa cómo:
   - La máquina cambia entre estados A, B, C
   - Escribe símbolos '1' en la cinta
   - Después de 21 pasos, se detiene (state H)
   - Deja 5 símbolos no-blancos

## 🔬 Máquina de Ejercicio 12

```
Estado A:
  Lee '0': Escribe '1', Derecha → Estado B
  Lee '1': Escribe '1', Derecha → Estado H

Estado B:
  Lee '0': Escribe '1', Izquierda → Estado B
  Lee '1': Escribe '0', Derecha → Estado C

Estado C:
  Lee '0': Escribe '1', Izquierda → Estado C
  Lee '1': Escribe '1', Izquierda → Estado A

Estado H: (Halt - Detención)
```

## 💡 Implicaciones Teóricas

1. **Uncomputability**: El número total de máquinas crece exponencialmente. Hacer una búsqueda exhaustiva se vuelve imposible rápidamente.

2. **Halting Problem**: No existe algoritmo que pueda predecir si cualquier máquina de Turing se detendrá o no.

3. **Limits of Computation**: Algunos busy beaver values requieren máquinas cada vez más complejas, sugiriendo límites fundamentales en lo que es computable.

## 📖 Lectura Adicional

- "The Busy Beaver Problem: A New Millennium Attack" - Scott Aaronson
- "Limits of Computation" - Wolfram MathWorld
- OEIS A060843 - Busy beaver challenge records
