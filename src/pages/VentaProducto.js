import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/venta_producto/";
const head = {
  method: "",
  url: url,
  params:{},
  data:{}
}

class VentaProducto extends Component {
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      id: '',
      cantidad: '',
      precio_unitario: '',
      id_inventario: '',
      id_vendedor: '',
      id_tipo_pago: ''
    }
  }
  inventario = [];
  constructor(){
    super()
    axios.get("http://localhost:8080/inventario/")
    .then(response=>{
      this.inventario = response.data.data;
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
      this.setState({modalEliminar: false});
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

  peticionPatch=()=>{
    head.method = "patch"
    head.data = this.state.form
    axios(head).then(response=>{
      this.modalInsertar();
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

  peticionPost=async()=>{
    delete this.state.form.id;
    head.method = "post"
    head.data = [this.state.form]
    console.log(head.data)
    await axios(head).then(response=>{
      this.modalInsertar();
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

  componentDidMount() {
    this.peticionGet();
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  seleccionarItem=(item)=>{
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id              : item.id,
        cantidad        : item.cantidad,
        precio_unitario : item.precio_unitario,
        id_inventario   : item.id_inventario,
        id_vendedor     : item.id_vendedor,
        id_tipo_pago    : item.id_tipo_pago
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
        <button className="btn btn-success" 
          onClick={()=>{
            this.setState({form: null, tipoModal: 'insertar'});
            this.modalInsertar()
            }
          }
        >
          Nueva venta
        </button>
        <br /><br />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>cantidad</th>
              <th>precio_unitario</th>
              <th>Producto</th>
              <th>Sucursal</th>
              <th>vendedor</th>
              <th>tipo_pago</th>
              <th>Editar/Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(item=>{
              return(
                <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.cantidad}</td>
                <td>{item.precio_unitario}</td>
                <td>{item.inventario.compra.producto.name}</td>
                <td>{item.inventario.sucursal.name}</td>
                <td>{item.vendedor}</td>
                <td>{item.tipo_pago}</td>
                <td>
                  <button className="btn btn-primary" onClick={()=>{this.seleccionarItem(item); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                  &nbsp;
                  <button className="btn btn-danger" onClick={()=>{this.seleccionarItem(item); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{display: 'block'}}>
            Nueva compra
            <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              {this.state.tipoModal==='insertar'?
              <>
                <input className="form-control" hidden type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form && form.id?form.id:''}/>
                <label htmlFor="id_inventario">Producto inventario</label>
                <select className="form-control" name="id_inventario" id="id_inventario" onChange={this.handleChange} defaultValue={form && form.id_inventario?form.id_inventario: ''}>
                {this.inventario.map(item=>{
                  return(
                    <option key={item.id} className="form-control" value={item.id}>{item.cantidad} - {item.compra.producto.name} - {item.sucursal.name}</option>
                    )
                  })}
                </select>
                <label htmlFor="precio_unitario">Precio unitario</label>
                <input className="form-control" type="text" name="precio_unitario" id="precio_unitario" onChange={this.handleChange} value={form && form.precio_unitario?form.precio_unitario: ''}/>
                <label htmlFor="cantidad">Cantidad</label>
                <input className="form-control" type="text" name="cantidad" id="cantidad" onChange={this.handleChange} value={form && form.cantidad?form.cantidad: ''}/>
                <label htmlFor="id_vendedor">Vendedor</label>
                <input className="form-control" type="text" name="id_vendedor" id="id_vendedor" onChange={this.handleChange} value={form && form.id_vendedor?form.id_vendedor: ''}/>
                <label htmlFor="id_tipo_pago">Tipo de pago</label>
                <input className="form-control" type="text" name="id_tipo_pago" id="id_tipo_pago" onChange={this.handleChange} value={form && form.id_tipo_pago?form.id_tipo_pago: 'EFECTIVO'}/>
              </>
              :null
              }
              <label htmlFor="description">Descripcion</label>

            </div>
          </ModalBody>
          <ModalFooter>
                {this.state.tipoModal==='insertar'?
                  <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>:
                  <button className="btn btn-primary" onClick={()=>this.peticionPatch()}>
                    Actualizar
                  </button>
                }
                  <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
              </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
              Estás seguro que deseas eliminar el compra "{form && form.id}"
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default VentaProducto;
