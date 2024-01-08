"use client";
import React, { useContext, useEffect, useRef,useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import styles from '../../public/styles.module.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

import { Chart } from 'primereact/chart';
        
export default function Home() {
  
  const toast = useRef(null); 
const [Nodes, setNodes] = useState(null);
const [max, setMaxLate] = useState(0);
const [probabi, setProb] = useState(0);
const [chartData, setChartData] = useState({});
const [chartOptions, setChartOptions] = useState({});


    
 


const [products, setProducts] = useState(null);
const [ruta, setCritica] = useState([]);


 //--> Cargar cuando se renderiza
 useEffect(() => {
  const datos = [
    {nomActividad: "Inicio",  a : 0, m: 0, b: 0,  te: 0},
    { nomActividad: "A",  Precedente: "Inicio",  a : 4, m: 5, b: 12,  te: 0},
    { nomActividad: "B",  Precedente: "Inicio",  a : 1, m: 1.5, b: 5,  te: 0},
    { nomActividad: "C", Precedente: "A",        a : 2, m: 3,b: 4,  te: 0},
    { nomActividad: "D", Precedente: "A",        a : 3, m: 4, b: 11,  te: 0},
    { nomActividad: "E", Precedente: "A",        a : 2, m: 3,b: 4,  te: 0},
    { nomActividad: "F", Precedente: "C",      a : 1.5,m: 2,b: 2.5,  te: 0},
    { nomActividad: "G", Precedente: "D",        a : 1.5, m: 3, b: 4.5,  te: 0},
    { nomActividad: "H", Precedente: "B,E",        a : 2.5, m: 3.5, b: 7.5,  te: 0},
    { nomActividad: "I", Precedente: "H",        a : 1.5, m: 2, b: 2.5,  te: 0},
    { nomActividad: "J", Precedente: "F,G,I",        a : 1, m: 2, b: 3,  te: 0}
   
   
   
  ]
  
  setProducts(datos)
 
}, []);





 
const Validar= (() => {
  
  const datos =  [...products];
  const datos2= [...products];
  
  const calcularTiempoEsperado = ({ a, m, b }) => (a + 4 * m + b) / 6;
  // Calcula el tiempo esperado para cada tarea
  datos.forEach((actividad) => {
    actividad.te = calcularTiempoEsperado(actividad);
  });
  
  // Función para calcular el tiempo de inicio más temprano y el tiempo de finalización más temprano
  const calcularTiemposMasTempranos = (actividades) => {
    const tiemposInicio = {};
    const tiemposFinalizacion = {};
  
    actividades.forEach((actividad) => {
      const tiemposPredecesoras = actividad.Precedente ? actividad.Precedente.split(',') : [];
      const tiempoInicio = tiemposPredecesoras.length > 0 ? Math.max(...tiemposPredecesoras.map((predecesora) => tiemposFinalizacion[predecesora] || 0)) : 0;
      const tiempoFinalizacion = tiempoInicio + actividad.te;
  
      tiemposInicio[actividad.nomActividad] = tiempoInicio;
      tiemposFinalizacion[actividad.nomActividad] = tiempoFinalizacion;
    });
  
    return { tiemposInicio, tiemposFinalizacion };
  };

  // Función para calcular el tiempo de inicio más tardío y el tiempo de finalización más tardío
   // Función para calcular el tiempo de inicio más tardío y el tiempo de finalización más tardío
   const calcularTiemposMasTardios = (actividades, tiemposMasTempranos) => {
    const tiemposInicioTardios = {};
    const tiemposFinalizacionTardios = {};
  
    // Inicializa los tiempos más tardíos con los tiempos más tempranos calculados previamente
    actividades.forEach((actividad) => {
      tiemposInicioTardios[actividad.nomActividad] = tiemposMasTempranos.tiemposInicio[actividad.nomActividad];
      tiemposFinalizacionTardios[actividad.nomActividad] = tiemposMasTempranos.tiemposFinalizacion[actividad.nomActividad];
    });
  
    // Calcula los tiempos más tardíos para cada actividad en orden inverso
    actividades.reverse().forEach((actividad) => {
      const tiemposSucesoras = actividades.filter((sucesora) => sucesora.Precedente && sucesora.Precedente.split(',').includes(actividad.nomActividad));
      
      if (tiemposSucesoras.length > 0) {
        const tiempoFinalizacionTardio = Math.min(...tiemposSucesoras.map((sucesora) => tiemposInicioTardios[sucesora.nomActividad]));
        tiemposFinalizacionTardios[actividad.nomActividad] = tiempoFinalizacionTardio;
        tiemposInicioTardios[actividad.nomActividad] = tiempoFinalizacionTardio - actividad.te;
      } else {
        tiemposInicioTardios[actividad.nomActividad] = tiemposFinalizacionTardios[actividad.nomActividad] - actividad.te;
      }
    });
  
    return { tiemposInicioTardios, tiemposFinalizacionTardios };
  };
  // Obtén los tiempos más tempranos
  const { tiemposInicio, tiemposFinalizacion } = calcularTiemposMasTempranos(datos);
  // Calcula los tiempos más tardíos
  const { tiemposInicioTardios, tiemposFinalizacionTardios } = calcularTiemposMasTardios(datos, { tiemposInicio, tiemposFinalizacion });




    const points = datos2.map(({ nomActividad,te,Precedente}) => {
    const parent = Precedente !== null ? Precedente : null;
    const tip=tiemposInicio[nomActividad];
    const ttp=tiemposFinalizacion[nomActividad];
    const tit=tiemposInicioTardios[nomActividad];
    const tft=tiemposFinalizacionTardios[nomActividad];
    const holgura=tft-ttp;
    const color = holgura >= 0.00001 ? "blue" : "red";
    
  
    return { name: nomActividad, id: nomActividad, parent, attributes:{type:color,length:te,earlyStart:tip,earlyFinish:ttp,lateStart:tit,lateFinish:tft,slack:holgura}};
    });
    setNodes(points);
    
    
    const critica=points.filter((objeto)=>objeto.attributes.type=="red").map(objeto=>objeto.name);
    setCritica(critica);

  // Utiliza reduce para encontrar el valor máximo de 'lateFinish'
  const maxLateFinish = points.reduce((max, node) => {
    const lateFinish = node.attributes && node.attributes.lateFinish;
    return lateFinish !== undefined ? Math.max(max, lateFinish) : max;
  }, -Infinity); // Inicializa 'max' con un valor muy pequeño
  setMaxLate(maxLateFinish);
    


 console.log(probabi)
 const grafica=((probabi) => {
  const documentStyle = getComputedStyle(document.documentElement);
  const data = {
      labels: ['Éxito', 'Fracaso'],
      datasets: [
          {
              data: [probabi*100,(1-probabi)*100],
              backgroundColor: [
                  documentStyle.getPropertyValue('--blue-500'), 
                  documentStyle.getPropertyValue('--yellow-500'), 
                  documentStyle.getPropertyValue('--green-500')
              ],
              hoverBackgroundColor: [
                  documentStyle.getPropertyValue('--blue-400'), 
                  documentStyle.getPropertyValue('--yellow-400'), 
                  documentStyle.getPropertyValue('--green-400')
              ]
          }
      ]
  }
  const options = {
      plugins: {
          legend: {
              labels: {
                  usePointStyle: true
              }
          }
      }
      
  };

  setChartData(data);
  setChartOptions(options);
});


grafica((calcularProbabilidadNormalAcumulativa(distribucion(desviacion(obtenerSumatoriaExpresion(products, ruta))), 0, 1)));
});


 //----------------| Lista de variables |----------------


  const onRowEditComplete = (e) => {
      let _products = [...products];
      let { newData, index } = e;
      _products[index] = newData;
      setProducts(_products);
     
  };


  

  const textEditor = (options) => {
      return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value) } />;
  };

  const numEditor = (options) => {
      return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)}/>;
  };

  const bodyTe = (rowData) => {
    return (
        <div className="">
           
            <span>{(rowData.te).toFixed(2)}</span>
        </div>
    );
};


const obtenerSumatoriaExpresion = (conjuntoActividades, actividades) => {
  let sumatoria = 0;

  actividades.forEach((actividad) => {
    const actividadEnConjunto = conjuntoActividades.find((a) => a.nomActividad === actividad);

    if (actividadEnConjunto) {
      const { a, b } = actividadEnConjunto;
      const c = b - a;
      sumatoria += (c /6) ** 2;
    }
  });

  return sumatoria;
};

const desviacion = (varianza) => {
  
  return Math.sqrt(varianza);
};

const [semanas, setSemanas] = useState(38);
const distribucion = (varianza) => {

  return (semanas-max)/varianza;
};



function calcularProbabilidadNormalAcumulativa(x, media, desviacion) {
  const z = (x - media) / desviacion;
  const cdf = 0.5 * (1 + erf(z / Math.sqrt(2)));

  return cdf;
}

// Función de error (erf)
function erf(z) {
  const t = 1.0 / (1.0 + 0.5 * Math.abs(z));
  const resultado = 1 - t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * (0.17087277))))))))));

  return z >= 0 ? resultado : -resultado;
}

const eliminarProducto = (id) => {
  if(id=="Inicio"){
    toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar ésta tarea', life: 3000 });
  }else{
    const nuevosProductos = products.filter((producto) => producto.nomActividad !== id);
    setProducts(nuevosProductos);
    toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Tarea Eliminada!', life: 3000 });
  }
  
};

const actionBodyTemplate = (rowData) => {
  console.log(rowData)
  return (
    
      <React.Fragment>
          
          <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => eliminarProducto(rowData.nomActividad)} />
      </React.Fragment>
  );
};

const agregarTarea = () => {
  const nuevaTarea = {
    nomActividad: "Nueva Tarea",
    Precedente: "-",
    a: 0,
    m: 0,
    b: 0,
    te: 0,
  };
  toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Tarea agregada!', life: 3000 });
  setProducts([...products, nuevaTarea]);
};
  //---------------------------| Valor que regresara |---------------------------
  return (
    <>
   
   <Toast ref={toast} />
    <div className="pl-8 pr-8">
    <h1 className='text-center mb-6'>PERT Probabilistico</h1>   
   
    <div className='justify-content-center'>
      <div className=''>
    
      <div className=" flex align-items-center justify-content-center mb-5 ">
            Ingresa el número de semanas para terminar el proyecto:  
            <InputNumber value={semanas} onValueChange={(e) => setSemanas(e.value)} />
        </div>
        </div>
        <div className="card p-fluid">
            <DataTable value={products} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '40rem' }}>
                <Column field="nomActividad" header="Actividad" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="Precedente" header="Precedente" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="a" header="A" editor={(options) => numEditor(options)} style={{ width: '5%' }}></Column>
                <Column field="m" header="M" editor={(options) => numEditor(options)} style={{ width: '5%' }}></Column>
                <Column field="b" header="B"  editor={(options) => numEditor(options)} style={{ width: '5%' }}></Column>
                <Column field="te" body={bodyTe} header="Tiempo Esperado" style={{ width: '7%' }}></Column>
                <Column rowEditor headerStyle={{ width: '5%'}} bodyStyle={{ textAlign: 'center' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ width: '5%' }}></Column>
            </DataTable>
        </div>
        <div className=" flex align-items-center justify-content-center ">
          </div>
    
    
    </div>
    <Button label="Realizar Cálculo"  type="button" onClick={()=> Validar()}  className={`mt-2 p-button-raised  ${styles.degradado}`} />
    <Button label="Agregar Tarea"  type="button" onClick={()=> agregarTarea()}  className={`ml-2 p-button-raised  ${styles.degradado}`} />
    </div>
    <div>
      
    <div className='flex'>
    <div>
    <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-20rem" />
    </div>
    <div className='mr-8'>
    <div className='flex  align-items-center justify-content-left'><h4 className=''>La ruta critica es:</h4> <span className="f">{ruta.reverse().join(",")}</span>, = {max} Semanas</div>
    <div className='flex align-items-center justify-content-left'> <h4>Varianza: </h4><span className=''>{obtenerSumatoriaExpresion(products, ruta).toFixed(2)}</span></div>
    <div className='flex align-items-center justify-content-left'><h4>Desviación estándar:</h4> <span className=''>{desviacion(obtenerSumatoriaExpresion(products, ruta)).toFixed(2)}</span></div>
    </div>
    <div>
   
    <div className='flex align-items-center justify-content-left'><h4>Distribución normal: </h4><span className=''>{distribucion(desviacion(obtenerSumatoriaExpresion(products, ruta))).toFixed(2)}</span></div>
    <div className='flex align-items-center justify-content-left'><h4>La probabilidad de éxtio es:</h4> <span className=''></span>{((calcularProbabilidadNormalAcumulativa(distribucion(desviacion(obtenerSumatoriaExpresion(products, ruta))), 0, 1))*100).toFixed(4)}%</div>
    </div>
    </div>
   
    
    
   </div>
   <footer className='text-center'>
        by
            <span className="ml-2 text-center">ChimmyGuegos</span>
           
            
            </footer>
    
  
      
 
    </>
    
  )
}
