import React, { useState } from 'react';
import { HelpCircle, BookOpen, Layers, Award, Terminal, Compass } from 'lucide-react';

export const HelpSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'guide' | 'puzzles'>('concepts');

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
        </div>
        <div>
          <h2 className="font-sans font-bold text-slate-800 text-lg">
            Aula Virtual & Guía del Estudiante
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Aprende los fundamentos matemáticos de la computación teórica con la máquina de Alan Turing.
          </p>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex border-b border-slate-100 gap-1 mb-6">
        <button
          onClick={() => setActiveTab('concepts')}
          className={`px-4 py-2 text-xs font-sans font-semibold transition-all border-b-2 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'concepts'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-slate-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Conceptos Clave
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2 text-xs font-sans font-semibold transition-all border-b-2 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'guide'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-slate-400'
          }`}
        >
          <Compass className="w-3.5 h-3.5" /> Guía de Experimentación
        </button>
        <button
          onClick={() => setActiveTab('puzzles')}
          className={`px-4 py-2 text-xs font-sans font-semibold transition-all border-b-2 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'puzzles'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-slate-400'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Enigmas de Computación
        </button>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[160px]">
        {activeTab === 'concepts' && (
          <div className="space-y-4 font-sans text-xs text-slate-600 leading-relaxed">
            <p>
              Inventada por el matemático británico <strong>Alan Turing</strong> en 1936, una máquina de Turing es un modelo matemático que define un dispositivo físico capaz de simular cualquier algoritmo de computadora, por complejo que sea (Tesis de Church-Turing).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <h4 className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Cinta Infinita
                </h4>
                <p className="text-[11px] text-slate-500">
                  La cinta actúa como celda de memoria de almacenamiento principal. Está dividida en casillas que contienen símbolos del alfabeto, incluyendo un símbolo especial en blanco para las secciones no inicializadas.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <h4 className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Cabezal de L/E
                </h4>
                <p className="text-[11px] text-slate-500">
                  Es el dispositivo lector que se sitúa sobre una casilla de la cinta. Puede leer el símbolo actual, sobrescribirlo por un símbolo nuevo y deslizarse un compartimiento a la izquierda (L) o a la derecha (R).
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <h4 className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Registro de Estados
                </h4>
                <p className="text-[11px] text-slate-500">
                  Mantiene el "estado mental" de la máquina de Turing. Cada estado representa un punto en el proceso del algoritmo. Hay estados de inicio, de aceptación y de rechazo bien diferenciados.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <h4 className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Tabla de Instrucciones
                </h4>
                <p className="text-[11px] text-slate-500">
                  La lógica de control. Indica: <em>"Si se está en el estado 'Q' y se lee el símbolo 'A', entonces se debe escribir 'B', mover el cabezal hacia 'D' y pasar al estado 'P'"</em>.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-4 font-sans text-xs text-slate-600 leading-relaxed">
            <p>
              Sigue estos sencillos pasos para interactuar con el simulador de manera óptima:
            </p>
            <ol className="list-decimal pl-4 space-y-2.5 text-slate-500 text-[11px]">
              <li>
                <strong className="text-slate-700">Selecciona un ejercicio:</strong> Usa el selector superior para cargar cualquiera de los 16 programas clásicos pre-compilados. Cambiará el riel de cinta y el diagrama del autómata automáticamente.
              </li>
              <li>
                <strong className="text-slate-700">Edita la entrada de prueba:</strong> Haz doble clic o clic en cualquier recuadro de la cinta para cambiar un símbolo por teclado comercial. También puedes escribir la cadena completa abajo en el campo <em>Cargar Entrada Alternativa</em>.
              </li>
              <li>
                <strong className="text-slate-700">Ejecuta a tu propio ritmo:</strong> Usa <span className="bg-blue-50 text-blue-600 font-semibold px-1 py-0.5 rounded border border-blue-100 font-mono">Ejecutar</span> para ver el avance automático, o haz clic en <span className="bg-slate-50 px-1 py-0.5 rounded border font-mono font-semibold">Paso Adelante</span> para estudiar en cámara lenta cómo cambian los bits y se iluminan las flechas en el gráfico de estados.
              </li>
              <li>
                <strong className="text-slate-700">Agrega tus propias instrucciones:</strong> Si estás creando un programa personalizado, escribe nuevos vectores de control en el panel de reglas inferior para guiar los saltos de tu cabezal.
              </li>
            </ol>
          </div>
        )}

        {activeTab === 'puzzles' && (
          <div className="space-y-3 font-sans text-xs text-slate-600 leading-relaxed">
            <p>
              ¿Quieres desafiar tus conocimientos? Intenta resolver o validar los siguientes escenarios clásicos:
            </p>
            <div className="space-y-2 pt-1">
              <div className="border border-slate-100 rounded-xl p-3 bg-indigo-50/20">
                <h5 className="font-bold text-slate-700 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-indigo-500" /> El Reto de la Multiplicación Binaria (10 * 11)
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Prueba a cargar un número binario diferente en el ejercicio de Multiplicación Binaria. ¿Logra la máquina resolver sumas repetidas de forma correcta? Observa cómo el acumulador añade bits en el extremo derecho.
                </p>
              </div>
              <div className="border border-slate-100 rounded-xl p-3 bg-amber-50/20">
                <h5 className="font-bold text-slate-700 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-amber-500" /> Castor Laborioso (Busy Beaver)
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  ¿Cómo puede un autómata escribir tantos unos sin quedarse en un bucle infinito? El Castor Laborioso con un alfabeto vacío logra balancear de forma extrema sus ciclos antes de detenerse de forma calculada. Ejecútalo con el modo <em>Súper Instantáneo</em> activo para observar la explosión de bits.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
