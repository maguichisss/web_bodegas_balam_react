import React, { Component } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://localhost:8080/compra/";
const head = {
  method: "",
  url: url,
  params:{},
  data:{}
}

class Compra extends Component {
  state={
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      id: '',
      precio_unitario: '',
      cantidad: '',
      costo_total: '',
      fecha_pedido: '',
      fecha_recibido: '',
      description: '',
      id_producto: '',
      id_estatus: '',
      id_proveedor: '',
      id_sucursal: ''
    }
  }
  productos = [];
  estatus_compra = [];
  proveedores = [];
  sucursales = [];
  constructor(){
    super()
    axios.get("http://localhost:8080/producto/")
    .then(response=>{
      this.productos = response.data.data;
    })
    axios.get("http://localhost:8080/estatus_compra/")
    .then(response=>{
      this.estatus_compra = response.data.data;
    })
    axios.get("http://localhost:8080/proveedor/")
    .then(response=>{
      this.proveedores = response.data.data;
    })
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
    delete this.state.form.id_sucursal;
    head.method = "patch"
    head.data = [this.state.form]
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
        precio_unitario : item.precio_unitario,
        cantidad        : item.cantidad,
        costo_total     : item.costo_total,
        fecha_pedido    : item.fecha_pedido,
        fecha_recibido  : item.fecha_recibido,
        description     : item.description,
        id_producto     : item.id_producto,
        id_estatus      : item.id_estatus,
        id_proveedor    : item.id_proveedor
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
          Nueva compra
        </button>
        <br /><br />
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Precio unitario</th>
              <th>Cantidad</th>
              <th>Costo total</th>
              <th>Fecha pedido</th>
              <th>Fecha recibido</th>
              <th>Descripcion</th>
              <th>Producto</th>
              <th>Estatus</th>
              <th>Proveedor</th>
              <th>Editar/Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(item=>{
              return(
                <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.precio_unitario}</td>
                <td>{item.cantidad}</td>
                <td>{item.precio_unitario*item.cantidad}</td>
                <td>{item.fecha_pedido}</td>
                <td>{item.fecha_recibido}</td>
                <td>{item.description}</td>
                <td>{item.producto.name}</td>
                <td>{item.estatus.estatus}</td>
                <td>{item.proveedor.name}</td>
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
              {form && form.id?
                <>
                <label hidden htmlFor="id">ID</label>
                <input className="form-control" hidden type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form.id}/>
                </>
                : null
              }

              {this.state.tipoModal==='insertar'?
              <>
                <label htmlFor="id_producto">Producto</label>
                <select className="form-control" name="id_producto" id="id_producto" onChange={this.handleChange} defaultValue={form && form.id_producto?form.id_producto: ''}>
                {this.productos.map(item=>{
                  return(
                    <option key={item.id} className="form-control" value={item.id}>{item.name}</option>
                    )
                  })}
                </select>
                <label htmlFor="cantidad">Cantidad</label>
                <input className="form-control" type="text" name="cantidad" id="cantidad" onChange={this.handleChange} value={form && form.cantidad?form.cantidad: ''}/>
                <label htmlFor="precio_unitario">Precio unitario</label>
                <input className="form-control" type="text" name="precio_unitario" id="precio_unitario" onChange={this.handleChange} value={form && form.precio_unitario?form.precio_unitario: ''}/>
                <label htmlFor="fecha_pedido">Fecha pedido</label>
                <input className="form-control" type="date" name="fecha_pedido" id="fecha_pedido" onChange={this.handleChange} value={form && form.fecha_pedido?form.fecha_pedido: ''}/>
                <label htmlFor="id_proveedor">Proveedor</label>
                <select className="form-control" name="id_proveedor" id="id_proveedor" onChange={this.handleChange} defaultValue={form && form.id_proveedor?form.id_proveedor: ''}>
                {this.proveedores.map(item=>{
                  return(
                    <option key={item.id} className="form-control" value={item.id}>{item.name}</option>
                    )
                })}
                </select>
                <label htmlFor="id_sucursal">Sucursal que recibe</label>
                <select className="form-control" name="id_sucursal" id="id_sucursal" onChange={this.handleChange} defaultValue={form && form.id_sucursal?form.id_sucursal: ''}>
                {this.sucursales.map(item=>{
                  return(
                    <option key={item.id} className="form-control" value={item.id}>{item.name}</option>
                    )
                })}
                </select>
              </>
              :null
              }
              <label htmlFor="id_estatus">Estatus</label>
              <select className="form-control" name="id_estatus" id="id_estatus" onChange={this.handleChange} defaultValue={form && form.id_estatus?form.id_estatus: ''}>
              {this.estatus_compra.map(item=>{
                return(
                  <option key={item.id} className="form-control" value={item.id}>{item.estatus}</option>
                  )
                })}
              </select>
              <label htmlFor="description">Descripcion</label>
              <input className="form-control" type="text" name="description" id="description" onChange={this.handleChange} value={form && form.description?form.description: ''}/>

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

export default Compra;
