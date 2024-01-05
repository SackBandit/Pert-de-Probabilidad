"use client";
import React, { useContext, useEffect, useRef,useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import styles from '../../public/styles.module.css';
import * as JSC from "jscharting";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';


export default function Home() {
  
  
const [Nodes, setNodes] = useState(null);


  //----------------| Lista de variables |----------------
  var palette = ['#f34f38', '#4285F4']; 

  var legendData = { 
    name: 'Actividad', 
    earlyStart: 'T. de inicio más pronto', 
    length: 'Duración', 
    earlyFinish: 'T. de termino más pronto', 
    lateStart: 'T. más tardado de inicio', 
    slack: 'Holgura', 
    lateFinish: 'T. más tardado de finalización'
  }; 
  // Group points by unique roles 
  const pointsByRoles = JSC.nest().key('attributes.type').entries(Nodes || []); 
    
  // Apply a color from palette to each group of points 
  pointsByRoles.forEach(function(group, i) { 
    group.values.forEach(function(point) { 
      JSC.merge(point, { 
        outline_color: palette[i], 
        color: [palette[i], 0.2], 
        connectorLine_color: palette[i] 
      }); 
    }); 
  }); 
    
  // Render the chart 
  const chart =JSC.chart('chartDiv1', { 
    debug: true, 
    type: 'organizational right', 
    defaultTooltip_enabled: false, 
    annotations: [ 
      { 
        label: { 
          text: makeLegendText(legendData), 
          align: 'center', 
          verticalAlign: 'middle'
        }, 
        asHTML: true, 
        position: 'top left', 
        margin: [-100, 10] 
      } 
    ], 
    defaultSeries: { 
      legendEntry_visible: false, 
      pointSelection: false, 
    
      defaultPoint: { 
        outline_width: 1, 
        /* Default line styling for connector lines */
        connectorLine: { 
          color: '#b6b6b6', 
          width: 1, 
          caps_end: { type: 'arrow', size: 8 } 
        }, 
        label: { 
          text: 
            '<table style="background-color:%type">' + 
            row( 
              col('%earlyStart') + 
              col('%length') + 
              col('%earlyFinish') 
            ) + 
            row('<td colspan="3">%name</td>') + 
            row( 
              
              col('%lateStart') + 
              col('%slack') + 
              col('%lateFinish') 
            ) + 
            '</table>', 
          color: 'black', 
          align: 'center'
        }, 
        annotation: { 
          asHTML: true, 
          padding: [4, 0], 
          margin: 30 
        } 
      } 
    }, 
    series: [{ points: Nodes }] 
  }); 
    
  function row(txt) { 
    return '<tr>' + txt + '</tr>'; 
  } 
     
  function col(txt) { 
    return '<td>' + txt + '</td>'; 
  } 
    
  function makeLegendText(data) { 
    return ( 
      '<table style="margin-left:30px;">' + 
      row( 
       
        col(data.earlyStart) + 
        col(data.length) + 
        col(data.earlyFinish) 
      ) + 
      row( 
        '<td colspan="3">' + data.name + '</td>'
      ) +  
      row( 
       
        col(data.lateStart) + 
        col(data.slack) + 
        col(data.lateFinish) 
      ) + 
      '</table>'
    ); 
  } 
  




const [products, setProducts] = useState(null);


 //--> Cargar cuando se renderiza
 useEffect(() => {
  const datos = [
    {nomActividad: "Inicio",  a : 0, m: 0, b: 0,  te: 0},
    { nomActividad: "A",  Precedente: "Inicio",  a : 2, m: 4, b: 7,  te: 0},
    { nomActividad: "B",  Precedente: "Inicio",  a : 5, m: 6, b: 8,  te: 0},
    { nomActividad: "C", Precedente: "A",        a : 7, m: 10,b: 13,  te: 0},
    { nomActividad: "D", Precedente: "B",        a : 7, m: 8, b: 11,  te: 0},
    { nomActividad: "E", Precedente: "B",        a : 8, m: 11,b: 13,  te: 0},
    { nomActividad: "F", Precedente: "C,D",      a : 10,m: 12,b: 15,  te: 0},
    { nomActividad: "G", Precedente: "E",        a : 6, m: 9, b: 12,  te: 0},
    { nomActividad: "H", Precedente: "E,F",      a : 4, m: 7, b: 9,  te: 0}
   
   
  ]
  
  setProducts(datos)
 
}, []);



const Validar= (() => {
  const datos = products;
  
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

  const { tiemposInicio, tiemposFinalizacion } = calcularTiemposMasTempranos(datos);

 
  

  
  

  const tareasUltimas = datos.filter((tarea) => !datos.some((otraTarea) => otraTarea.Precedente && otraTarea.Precedente.split(',').includes(tarea.nomActividad)));
  const ultimas=[];
  for(let m=0; m<tareasUltimas.length;m++){
      ultimas[m]=tareasUltimas[m].nomActividad;
  }



  const points = datos.map(({ nomActividad,te,Precedente}) => {
  const parent = Precedente !== null ? Precedente : null;
  const tip=tiemposInicio[nomActividad];
  const ttp=tiemposFinalizacion[nomActividad];
  const tit= ultimas.includes(nomActividad) ? tiemposFinalizacion[ultimas.slice(-1)] : 0

  return { name: nomActividad, id: nomActividad, parent, attributes:{type:'red',length:te,earlyStart:tip,earlyFinish:ttp,lateStart:tit}};
});
setNodes(points);


 
});


  const onRowEditComplete = (e) => {
      let _products = [...products];
      let { newData, index } = e;
      _products[index] = newData;
      setProducts(_products);
     
  };

  const textEditor = (options) => {
      return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
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



  
  //---------------------------| Valor que regresara |---------------------------
  return (
    <>
   
    
    <div className="pl-8 pr-8">
    <h1 className='text-center mb-6'>PERT Probabilistico</h1>   
   
    <div className='justify-content-center'>
      <div className=''>
    
        
        </div>
        <div className="card p-fluid">
            <DataTable value={products} editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete} tableStyle={{ minWidth: '40rem' }}>
                <Column field="nomActividad" header="Actividad" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="Precedente" header="Precedente" editor={(options) => textEditor(options)} style={{ width: '10%' }}></Column>
                <Column field="a" header="A" editor={(options) => numEditor(options)} style={{ width: '5%' }}></Column>
                <Column field="m" header="M" editor={(options) => numEditor(options)} style={{ width: '5%' }}></Column>
                <Column field="b" header="B"  editor={(options) => numEditor(options)} style={{ width: '5%' }}></Column>
                <Column field="te" body={bodyTe} header="Tiempo Esperado" style={{ width: '7%' }}></Column>
                <Column rowEditor headerStyle={{ width: '7%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            </DataTable>
        </div>
        <div className=" flex align-items-center justify-content-center ">
          <Button label="Agregar actividad"  type="button" onClick={()=> Validar()}  className={`mt-2 p-button-raised  ${styles.degradado}`} />
          </div>
    
    
    </div>
    <Button label="Realizar Cálculo"  type="button" onClick={()=> Validar()}  className={`mt-2 p-button-raised  ${styles.degradado}`} />
    </div>
   
  <div className='mt-3 card' >
  <h3 className='text-center mb-6'>Diagrama PERT</h3>   
  <div id="chartDiv1" className={`m-0 ${styles.chartDiv}`}    style={{height:'420px ',margin:'0 auto', padding:'0 auto'}}/>
  </div>

  
      
 
    </>
    
  )
}
