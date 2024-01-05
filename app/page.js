"use client";
import React, { useContext, useEffect, useRef } from 'react';
import styles from '../public/styles.module.css';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

export default function Home() {
  //----------------| Lista de variables |----------------
  const router=useRouter();
 
  //---------------------------| Valor que regresara |---------------------------
  return (
    <>
    
  
    <div className="grid grid-nogutter surface-0 text-800 mt-10">
    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
        <section>
            <span className="block text-6xl font-bold mb-1">Pert Probabilistico</span>
            <div className="text-2xl font-semibold mb-3 "><h3 className={`${styles.sub}`}>Modelos de Distribución de Probabilidad en PERT.</h3></div>
            <p className="mt-0 mb-4 text-700 line-height-3">El PERT Probabilístico es una extensión del PERT clásico que incorpora la incertidumbre en las estimaciones de tiempo del proyecto. Utiliza distribuciones de probabilidad para modelar la variabilidad en las duraciones de las actividades, ofreciendo una visión más realista de los riesgos asociados con el cronograma del proyecto.</p>

            <Button label="Leer más" type="button" className="mr-3 p-button-raised "severity="secondary" />
            <Button label="Probar" type="button" className="p-button-outlined" severity="secondary" onClick={() => {router.push('/calculadora')}}/>
        </section>
    </div>
    <div className={`col-12 md:col-6 overflow-hidden p-8 ${styles.degradado}`} style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 75%, 0 75%)',transform: 'scale(1)',height:"600px",backgroundColor:'white'} }>
        <img src="/pert.png" className={`w-7 `} alt="pert" style={{ transform:'translateX(50%)'}}/>
    </div>
  </div>
   
   
        <footer className='text-center'>
        by
            <span className="ml-2 text-center">ChimmyGuegos</span>
           
            
            </footer>
    
    </>
    
  )
}

