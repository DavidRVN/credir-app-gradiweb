import Cards from 'react-credit-cards';
import React, { useState } from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button";

const PaymentForm = () => {

    // Creo los estados iniciales de manera que pueda modificarlos a lo largo de la implementación
    const [state, setState] = useState({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
        focus: ""
    })

    // Valido en donde están haciendo clic para mostar el giro de la tarjeta según sea el caso
    function handleFocusChange(e) {
        setState({
            ...state,
            focus: e.target.name
        });
    }


    //Validar los campos del formulario y enseño un mensje para cada uno de ellos
    const [errors, setErrors] = useState({});
    function handleInputChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    function validate() {
        let tempErrors = {};
        if (!state.name) {
            tempErrors.message = 'Nombre es requerido';
        }
        else if (!state.number) {
            tempErrors.message = 'Número de tarjeta es requerido';
        }
        else if (!state.cvc) {
            tempErrors.message = 'El código de verificación es necesario';
        }
        else if (!state.expiry) {
            tempErrors.message = 'Fecha de expiración necesaria';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    // Capturo los datos de la tarjeta y luego lo guardo y lo muestro
    const [data, setData] = useState([]);

    // luego de validar los campos, guardo estos y procedo a limpiar el formulario
    function handleSubmit(event) {
        event.preventDefault();
        if (validate()) {
            // Aquí se hace la lógica de envío de formulario              
            setData([...data, state]);
            setState({
                number: "",
                name: "",
                expiry: "",
                cvc: "",
            });
        }
    }

    //Valido que solo puedan ingresar numeros en los campos de número de tarjeta, fecha de expiración y CVC
    function keyPress(e) {
        let tempErrors = {};
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
            tempErrors.onlyNumbers = 'Solo se aceptan números';
            setErrors(tempErrors);
        }
        else {
            setErrors(tempErrors);
        }
    }

    //Valido cantidad de caracteres para las tarjetas, en este caso 16
    function numberCard(e) {
        let tempErrors = {};
        if (state.number.length < 16) {
            e.preventDefault();
            tempErrors.msgCardNumber = 'Número de tarjeta inválido';
            setErrors(tempErrors);
        }
        else {
            tempErrors.msgCardNumber = 'Número de tarjeta inválido';
            setErrors(tempErrors);
        }
    }


    // Elimino el registro de una tarjeta de crédito
    function removeCard(number) {
        const newCards = data.filter((data) => data.number !== number);
        setData(newCards);
    }


    //Muestro y oculto la table donde esta la información de la tarjeta
    const [showComponent, setShowComponent] = useState(false);
    const handleShow = () => {
        setShowComponent(!showComponent);
    };

    return (

        <div className='card'>
            <div className='card-body'>
                <center><Alert variant="outlined" severity="info" centered>Formulario de pago</Alert>&nbsp;&nbsp;</center>
                
                <Cards
                    number={state.number}
                    name={state.name}
                    expiry={state.expiry}
                    cvc={state.cvc}
                    focused={state.focus}
                    placeholders={{ name: 'Tu nombre', }}
                    preview={false}
                />
                &nbsp;
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label htmlFor="number">Número de tarjeta</label>
                        <input type="text" maxLength={16} name="number" required={true} value={state.number} id='number' className='form-control' onKeyPress={keyPress} onChange={(e) => { numberCard(e); handleInputChange(e) }} onFocus={handleFocusChange} />
                    </div>&nbsp;
                    <div className='form-group'>
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name="name" maxLength={30} value={state.name} id='name' className='form-control' onChange={handleInputChange} onFocus={handleFocusChange} />
                    </div>&nbsp;
                    <div className='form-group row'>
                        <div className='form-group col-md-6' >
                            <label htmlFor="expiry">Fecha de expiración</label>

                            <input type="text" name="expiry" maxLength={4} value={state.expiry} id='expiry' className='form-control' onChange={handleInputChange} onKeyPress={keyPress} onFocus={handleFocusChange} />
                        </div>
                        <div className='form-group col-md-6' >
                            <label htmlFor="cvc">CVC</label>
                            <input type="text" name="cvc" maxLength={4} value={state.cvc} id='cvc' className='form-control' onChange={handleInputChange} onFocus={handleFocusChange} onKeyPress={keyPress} />
                        </div>  &nbsp;

                    </div>&nbsp;
                    {errors.message && <Alert variant="outlined" severity="error">{errors.message}</Alert>}    &nbsp;
                    {errors.msgCardNumber && <Alert variant="outlined" severity="error">{errors.msgCardNumber}</Alert>}  &nbsp;
                    {errors.onlyNumbers && <Alert variant="outlined" severity="info">{errors.onlyNumbers}</Alert>}&nbsp;&nbsp;
                    <center> <Button variant="contained" color="success" type='submit'> Enviar</Button>  <Button variant="contained" color="warning" onClick={handleShow} > Consultar tarjetas</Button> </center>
                </form>
 
            </div>
            {showComponent && (
                <table className='table table-striped table-data' >
                    <thead>
                        <tr>
                            <th scope="col">
                                Número de tarjeta
                            </th>
                            <th scope="col">
                                Nombre propietario
                            </th>
                            <th scope="col">
                                Fecha expiración
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map((datas) => (
                                <tr>
                                    <td onClick={() => removeCard(datas.number)}>{datas.number.split('').map((char, index) => (index >= datas.number.length - 4 ? char : '*')).join('')}</td>
                                    <td >{datas.name}</td>
                                    <td >{datas.expiry.slice(0, 2) + '/' + datas.expiry.slice(2)}</td>
                                </tr>
                            ))}
                    </tbody></table>
            )}
        </div>

    )
}

export default PaymentForm