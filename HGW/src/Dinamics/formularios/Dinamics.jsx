import {
    InputLabel, Slide, Box, TextField, Select, Button, FormControl, MenuItem, Typography,
    Alert, AlertTitle
} from '@mui/material'
import { useState, useEffect, useRef, useReducer, useCallback, memo, useMemo, useContext } from 'react'
import { AppContext } from '../../controlador';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import Style from './Dinamics.module.scss'

const BACKEND = 'http://127.0.0.1:5000'

const Form = memo(({ form, consultas, edit, padre, alerta }) => {
  const editara = Object.entries(edit).length > 0 ? edit.estado : false
  const datosEdit = edit?.datos || {}
  const { medidas, anchoDrawer } = useContext(AppContext)
  const [consultasCargadas, setConsultasCargadas] = useState({})
  const didReset = useRef(false)

  useEffect(() => {
    if (!consultas) return
    fetch(`${BACKEND}/consultas`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(consultas)
    })
      .then(r => r.json())
      .then(setConsultasCargadas)
  }, [consultas])

  const crearObjeto = useCallback(
    datos => {
      const objeto = {}
      datos.forEach(el => {
        if (!el.id) return
        let initialValue = ''
        if (editara) {
          if (el.type === 'img') {
            const filename = datosEdit[el.id]
            if (typeof filename === 'string' && filename) {
                const url = `${BACKEND}/images/${filename}`
                initialValue = url
                objeto[el.id] = {
                value: url,
                preview: url,
                error: false,
                helperText: '',
                id: el.id
              }
              return
            }
          }
          else if (el.type === 'select') {
            const clave = el.childs.table === 'categorias' ? 'categoria' : el.childs.table
            const raw = datosEdit[clave] ?? ''
            const num = parseInt(raw, 10)
            initialValue = Number.isNaN(num) ? '' : num
          }
          else {
            initialValue = datosEdit[el.id] ?? ''
          }
        }
        objeto[el.id] = { value: initialValue, error: false, helperText: '', id: el.id }
      })
      return objeto
    },
    [editara, datosEdit]
  )

  const asignarValores = useCallback((estado, action) => {
    if (action.type === 'RESET') return action.objeto
    if ('error' in action) {
      return {
        ...estado,
        [action.id]: { ...estado[action.id], error: action.error, helperText: action.helperText || '' }
      }
    }
    if ('value' in action) {
      return {
        ...estado,
        [action.id]: { ...estado[action.id], value: action.value, ...(action.preview !== undefined && { preview: action.preview }) }
      }
    }
    return estado
  }, [])

  const [valores, dispatch] = useReducer(asignarValores, form, crearObjeto)

  useEffect(() => {
    didReset.current = false
  }, [edit])

  useEffect(() => {
    if (editara && Object.keys(datosEdit).length > 0 && !didReset.current) {
      dispatch({ type: 'RESET', objeto: crearObjeto(form) })
      didReset.current = true
    }

  }, [editara, datosEdit, form, crearObjeto])
  const validaciones = useCallback((datos, manejador, formArray) => {
    for (const element of formArray) {
      if (!element.id || !element.requirements) continue
      const valor = datos[element.id].value
      const req = element.requirements
      if ('maxLength' in req || 'minLength' in req) {
        const max = req.maxLength || 99999
        const min = req.minLength || 0
        if (valor.length > max || valor.length < min) {
          manejador({ id: element.id, error: true, helperText: `debe tener entre ${min} y ${max} caracteres` })
          return false
        }
      }
      if ('value' in req) {
        const faltan = []
        req.value.forEach(v => {
          if (!valor.includes(v)) {
            faltan.push(v)
          }
        })
        if (faltan.length > 0) {
          manejador({ id: element.id, error: true, helperText: 'Debe contener: ' + faltan.join(', ') })
          return false
        }
        manejador({ id: element.id, error: false })
        return true
      }
    }
  }, [])

  const setValuesChilds = (elemento, e)=>{
    const data = elemento.changeTable
      fetch(`${BACKEND}/consultas`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ table: data.table, columnDependency: data.columnDependency, foreign: e })
        })
      .then(r => r.json())
      .then(r => setConsultasCargadas({ ...consultasCargadas, ...r }))
  }

  const verDependencia = useCallback(dep => {
    if (!dep) return true
    if (!valores[dep.elemento]) return false
    const v = valores[dep.elemento].value
    return v !== '' && v !== 0
  }, [valores])

  const handle = useCallback((e, tipo, id) => {
    if (tipo === 'img') {
      const file = e
      if (!file) return
      const preview = URL.createObjectURL(file)
      dispatch({ id, value: file, preview })
    } else {
      dispatch({ id, value: e })
    }
  }, [dispatch])

  const opcionesPorTabla = useMemo(() => {
    const out = {}
    Object.entries(consultasCargadas).forEach(([tabla, filas]) => {
      out[tabla] = filas.map(row => {
        const idKey = Object.keys(row).find(k => k.toLowerCase().includes('id'))
        const nombreKey = Object.keys(row).find(k => k.toLowerCase().includes('nombre'))
        return { id: row[idKey], nombre: row[nombreKey] }
      })
    })
    return out
  }, [consultasCargadas])
  const renderCampos = useMemo(() => form.map(elemento => {
    if (elemento.type === 'input' && verDependencia(elemento.dependency)) {
      return (
        <TextField
          key={elemento.id}
          id={elemento.id}
          label={elemento.label}
          variant="standard"
          fullWidth
          margin="normal"
          type={elemento.typeOf && elemento.typeOf !== '' ? elemento.typeOf : 'string'}
          value={valores[elemento.id].value}
          error={valores[elemento.id].error}
          helperText={valores[elemento.id].helperText}
          onChange={e => handle(e.target.value, 'input', elemento.id)}
          InputLabelProps={{ shrink: Boolean(valores[elemento.id].value) }}
        />
      )
    }
    if (elemento.type === 'select' && verDependencia(elemento.dependency)) {
      const opciones = opcionesPorTabla[elemento.childs.table] || []
      return (
        <FormControl key={elemento.id} fullWidth margin="normal">
          <InputLabel id={`${elemento.id}-label`}>{elemento.label}</InputLabel>
          <Select
            labelId={`${elemento.id}-label`}
            label={elemento.label}
            value={valores[elemento.id]?.value ?? ''}
            onChange={e => {
              if ('changeTable' in elemento) {
                setValuesChilds(elemento, e.target.value)
              }
              handle(e.target.value, 'select', elemento.id)
              if("changeTable" in elemento){
                handle("", "select", elemento.changeTable.table)
              }
            }}
            variant="filled"
            MenuProps={{ disablePortal: true, disableAutoFocusItem: true }}
          >
            {opciones.map(opt => <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>)}
          </Select>
        </FormControl>
      )
    }
    if (elemento.type === 'img') {
      return (
        <Button
          key={elemento.id}
          component="label"
          sx={{ background: 'rgb(232,248,230)', width: '100%', height: '90px', mt: 2, position: 'relative' }}
        >
          <CloudUploadIcon />
          <input type="file" accept="image/*" hidden onChange={e => handle(e.target.files[0], 'img', elemento.id)} />
          {valores[elemento.id].preview ? (
            <Box
              component="img"
              src={valores[elemento.id].preview}
              sx={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'contain' }}
            />
          ) : valores[elemento.id].value ? (
            <Box
              component="img"
              src={valores[elemento.id].value}
              sx={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'contain' }}
            />
          ) : null}
        </Button>
      )
    }
    if (elemento.type === 'submit') {
      return (
        <Button
          key="submit"
          variant={elemento.variant}
          sx={{ color: 'white', mt: 2 }}
          onClick={async () => {
            if (!validaciones(valores, dispatch, form)) return
            const payload = new FormData()
            Object.entries(valores).forEach(([key, campo]) => {
              if (campo.value instanceof File) {
                payload.append(key, campo.value)
              } else if (campo.value !== undefined && campo.value !== null) {
                payload.append(key, String(campo.value))
              }
            })
            payload.append('table', elemento.submit)
            if (editara) {
              const idEdit = Object.entries(datosEdit).find(([k]) => k.toLowerCase().includes('id'))[1]
              payload.append('id', idEdit)
            }
            const url = editara ? `${BACKEND}/editar` : `${BACKEND}/registro`
            const res = await fetch(url, { method: 'POST', body: payload })
            const json = await res.json()
            if (json.uploaded) {
              Object.entries(json.uploaded).forEach(([campoId, filename]) => {
                dispatch({ id: campoId, value: `${BACKEND}/images/${filename}`, preview: undefined })
              })
            }
            alerta.setAlerta({
              estado: true,
              valor: { title: 'Completado', content: json.respuesta },
              ...(editara && { lado: 'izquierdo' })
            })
            if (editara) padre.setRender(r => !r)
          }}
        >
          {elemento.label}
        </Button>
      )
    }
    return null
  }), [form, consultasCargadas, valores, handle, validaciones, verDependencia, editara, datosEdit, padre, alerta])

  return (
    <Slide in direction="left" timeout={400}>
      <Box sx={{ width: medidas === 'movil' ? '90%' : '98%', ...(editara && { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }) }}>
        <Box className={Style.formulario} sx={{
          overflowY: 'scroll',
          margin: !editara ? '3.5vh 1%' : '',
          background: 'white',
          width: editara ? '70%' : '100%',
          height: '80vh',
          ...(editara && { justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }),
          '&::-webkit-scrollbar': { width: '2.5px' },
          '&::-webkit-scrollbar-thumb': { background: '#7e9e4a', borderRadius: '5px' }
        }}>
          <Typography>{form[0].title}</Typography>
          <Box className={Style.formulario} sx={{ flex: 1, ...(medidas !== 'movil' && { maxWidth: '50%' }), background: 'white', display: 'flex', flexDirection: 'column' }}>
            {renderCampos}
          </Box>
        </Box>
      </Box>
    </Slide>
  )
})

const DinamicForm = ({ form, consultas, edit, padre }) => {
    let editara = edit ? edit.estado : false;
    const { medidas, anchoDrawer, alerta } = useContext(AppContext);
    const contenidoWidth = anchoDrawer.isOpen
        ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
        : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`;
    return (
        <Box className="box-contenidos" sx={{ width: medidas == "movil" || editara ? "100%" : contenidoWidth, transition: "450ms" }}>
            <Form form={form} consultas={consultas} edit={edit ? edit : {}} padre={padre} alerta={alerta} />
        </Box>
    )
}

export default memo(DinamicForm);