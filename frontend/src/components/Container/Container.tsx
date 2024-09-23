import React, { ReactNode } from 'react';
import './Container.css'

interface ContainerProps {
    children: ReactNode; // Define the type for children
  }

const   Container: React.FC<ContainerProps> = (props) => {
  return (
    <div className=' container main-container'>
      {props.children}</div>
  )
}

export default Container
