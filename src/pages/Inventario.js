import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/inventario/";
const head = {
  method: "",
  url: url,
  params:{},
  data:{}
}

class Inventario extends Component {
  state={
    data:[],
    modalOpen: false,
    form:{
      id: '',
      precio_minimo_venta: '',
      cantidad: '',
      id_sucursal_destino: ''
    }
  }
  sucursales = [];
  constructor(){
    super()
    axios.get("http://localhost:8080/sucursal/")
    .then(response=>{
      this.sucursales = response.data.data;
    })
    //.catch(error=>{
    //  if (error.response){
    //    console.log(error.response.data);
    //    console.log(error.response);
    //  }else if(error.request){
    //    console.log(error.request);
    //    console.log(error.message);
    //  }else if(error.message){
    //    console.log(error.message);
    //  }
    //})
  }

  peticionGet=()=>{
    head.method = "get"
    axios(head)
    .then(response=>{
      this.setState({data: response.data.data});
    })
    .catch(error=>{
      if (error.response){
        console.log(error.response.data);
        console.log(error.response);
      }else if(error.request){
        console.log(error.request);
        console.log(error.message);
      }else if(error.message){
        console.log(error.message);
      }
    })
  }

  peticionDelete=()=>{
    head.method = "delete"
    head.data = {id:[this.state.form.id]}
    axios(head).then(response=>{
      this.setState({modalTraspaso: false});
      this.peticionGet();
    })
    .catch(error=>{
      if (error.response){
        console.log(error.response.data);
        console.log(error.response);
      }else if(error.request){
        console.log(error.request);
        console.log(error.message);
      }else if(error.message){
        console.log(error.message);
      }
    })
  }

  peticionPatch=(action)=>{
    delete this.state.form.id_sucursal;
    head.method = "patch"
    head.data = this.state.form
    head.data.action = action
    console.log(head.data)
    axios(head).then(response=>{
      this.modalOpen();
      this.peticionGet();
      console.log(response.data);
    })
    .catch(error=>{
      if (error.response){
        console.log(error.response.data);
        console.log(error.response);
      }else if(error.request){
        console.log(error.request);
        console.log(error.message);
      }else if(error.message){
        console.log(error.message);
      }
    })
  }

  componentDidMount() {
    this.peticionGet();
  }

  modalOpen=()=>{
    this.setState({modalOpen: !this.state.modalOpen});
  }

  seleccionarItem=(item)=>{
    this.setState({
      modalAction: 'traspaso',
      form: {
        id                  : item.id,
        precio_minimo_venta : item.precio_minimo_venta,
        cantidad            : item.cantidad,
        id_sucursal_destino : item.sucursal.id
      }
    })
  }

  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  render(){
    const {form}=this.state;
    return (
      <div className="App">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sucursal</th>
              <th>Producto</th>
              <th>precio_unitario</th>
              <th>cantidad</th>
              <th>precio_minimo_venta</th>
              <th>porcentaje_ganancia</th>
              <th>precio_reventa</th>
              <th>porcentaje_reventa</th>
              <th>vendido</th>
              <th>stock</th>
              <th>Establecer precio/Traspaso</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(item=>{
              return(
                <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.sucursal.name}</td>
                <td>{item.compra.producto.name}</td>
                <td>{item.precio_unitario}</td>
                <td>{item.cantidad}</td>
                <td>{item.precio_minimo_venta}</td>
                <td>{item.porcentaje_ganancia*100}%</td>
                <td>{item.precio_reventa}</td>
                <td>{item.porcentaje_reventa*100}%</td>
                <td>{item.vendido}</td>
                <td>{item.stock}</td>
                <td>
                  <button className="btn btn-primary" onClick={()=>{this.seleccionarItem(item); this.setState({modalAction: 'setPrecio'}); this.modalOpen()}}><FontAwesomeIcon icon={faMoneyBill}/></button>
                  &nbsp;
                  <button className="btn btn-success" onClick={()=>{this.seleccionarItem(item); this.setState({modalAction: 'traspaso'}); this.modalOpen()}}><FontAwesomeIcon icon={faExchangeAlt}/></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <Modal isOpen={this.state.modalOpen}>
          <ModalHeader style={{display: 'block'}}>
            Inventario
            <span style={{float: 'right'}} onClick={()=>this.modalOpen()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              {this.state.modalAction==='setPrecio'?
              <>
                Establecer el precio<br/>
                <label htmlFor="precio_minimo_venta">Precio minimo de venta</label>
                <input className="form-control" type="text" name="precio_minimo_venta" id="precio_minimo_venta" onChange={this.handleChange} value={form && form.precio_minimo_venta?form.precio_minimo_venta: ''}/>
              </>
              :
              <>
                Traspaso<br/>
                <label htmlFor="cantidad">Cantidad</label>
                <input className="form-control" type="text" name="cantidad" id="cantidad" onChange={this.handleChange} value={form && form.cantidad?form.cantidad: ''}/>
                <label htmlFor="id_sucursal_destino">Sucursal</label>
                <select className="form-control" name="id_sucursal_destino" id="id_sucursal_destino" onChange={this.handleChange} defaultValue={form && form.id_sucursal_destino?form.id_sucursal_destino: ''}>
                {this.sucursales.map(item=>{
                  return(
                    <option key={item.id} className="form-control" value={item.id}>{item.name}</option>
                    )
                })}
                </select>
              </>
              }
              <input hidden readOnly type="text" name="id" id="id" value={form.id}/>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-success" onClick={()=>this.peticionPatch(this.state.modalAction==='setPrecio'? "set_precio":"traspaso")}>
              Actualizar
            </button>
            <button className="btn btn-danger" onClick={()=>this.modalOpen()}>Cancelar</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Inventario;
