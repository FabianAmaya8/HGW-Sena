import {
    InputLabel, Slide, Box, TextField, Select, Button, FormControl, MenuItem, Typography,
    Alert, AlertTitle
} from '@mui/material'
import { useState, useEffect, useRef, useReducer, useCallback, memo, useMemo, useContext } from 'react'
import { AppContext } from '../../controlador';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { CircularProgress } from '@mui/material';
import Style from './Dinamics.module.scss'
import Carga from '../../intermedias/carga';
import LinearProgress from '@mui/material/LinearProgress';

const BACKEND = 'http://127.0.0.1:3000'

const Form = memo(({ form, consultas, edit, padre, alerta }) => {
  const editara = Object.entries(edit).length > 0 ? edit.estado : false
  const datosEdit = edit?.datos || {}
  const { medidas, anchoDrawer } = useContext(AppContext)
  const [consultasCargadas, setConsultasCargadas] = useState({})
  const didReset = useRef(false)
  const didAutoChange = useRef(false)
  useEffect(() => {
    let ignore = false
    if (!consultas) return
    fetch(`${BACKEND}/consultas`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(consultas)
    })
      .then(r => r.json())
      .then(data => { if (!ignore) setConsultasCargadas(data) })
    return () => { ignore = true }
  }, [consultas])
  const normalizaUrlImagen = (valor) => {
    if (!valor) return ''
    if (valor.startsWith('http')) {
      try {
        const url = new URL(valor)
        return `${BACKEND}/images/${url.pathname.split('/').pop()}`
      } catch {
        return `${BACKEND}/images/${valor}`
      }
    }
    return `${BACKEND}/images/${valor}`
  }
  const crearObjeto = useCallback(
    datos => {
      const objeto = {}
      for (let i = 0; i < datos.length; i++) {
        const el = datos[i]
        if (!el.id) continue
        let initialValue = ''
        if (editara) {
          if (el.type === 'img') {
            const filename = datosEdit[el.id]
            if (typeof filename === 'string' && filename) {
              const url = normalizaUrlImagen(filename)
              objeto[el.id] = {
                value: url,
                preview: url,
                error: false,
                helperText: '',
                id: el.id
              }
              continue
            }
          } else if (el.type === 'select') {
            if (datosEdit[el.id] && typeof datosEdit[el.id] === 'object' && 'id' in datosEdit[el.id]) {
              initialValue = datosEdit[el.id].id
            } else {
              initialValue = ''
            }
          } else {
            initialValue = datosEdit[el.id] ?? ''
          }
        }
        objeto[el.id] = { value: initialValue, error: false, helperText: '', id: el.id }
      }
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
      didAutoChange.current = false
    }
  }, [editara, datosEdit, form, crearObjeto])

  useEffect(() => {
    if (!editara || didAutoChange.current) return
    for (const elemento of form) {
      if (elemento.type === 'select' && 'changeTable' in elemento) {
        const padreValue = valores[elemento.id]?.value
        if (padreValue) {
          setValuesChilds(elemento, padreValue)
          didAutoChange.current = true
        }
      }
    }
  }, [editara, form, valores])
  const validaciones = useCallback((datos, manejador, formArray) => {
    let valido = true
    for (let i = 0; i < formArray.length; i++) {
      const element = formArray[i]
      if (!element.id || !element.requirements) continue
      const valor = datos[element.id].value
      const req = element.requirements
      let error = false
      let helperText = ''
      if ('maxLength' in req || 'minLength' in req) {
        const max = req.maxLength || 99999
        const min = req.minLength || 0
        if (valor.length > max || valor.length < min) {
          error = true
          helperText = `debe tener entre ${min} y ${max} caracteres`
        }
      }
      if ('value' in req) {
        const faltan = req.value.filter(v => !valor.includes(v))
        if (faltan.length > 0) {
          error = true
          helperText = 'Debe contener: ' + faltan.join(', ')
        }
      }
      manejador({ id: element.id, error, helperText })
      if (error) valido = false
    }
    return valido
  }, [])
  const valoresRef = useRef(valores)
  useEffect(() => {
    valoresRef.current = valores
  }, [valores])
  const setValuesChilds = (elemento, valorPadre, resetHijo = false) => {
    const data = elemento.changeTable
    fetch(`${BACKEND}/consultas`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ table: data.table, columnDependency: data.columnDependency, foreign: valorPadre })
    })
      .then(r => r.json())
      .then(r => {
        setConsultasCargadas(prev => ({ ...prev, ...r }))
        const tabla = data.table
        const opciones = Object.values(r)[0] || []
        const hijoId = tabla
        if (resetHijo) {
          dispatch({ id: hijoId, value: '' })
          return
        }
        const valueActual = valoresRef.current[hijoId]?.value
        const existeValorActual = opciones.some(opt => String(opt.id) === String(valueActual))
        if (existeValorActual) {
          dispatch({ id: hijoId, value: valueActual })
        } else {
          const valorGuardado = datosEdit[hijoId]?.id ?? ''
          const existeValorGuardado = opciones.some(opt => String(opt.id) === String(valorGuardado))
          if (existeValorGuardado) {
            dispatch({ id: hijoId, value: valorGuardado })
          } else {
            dispatch({ id: hijoId, value: '' })
          }
        }
      })
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
    for (const tabla in consultasCargadas) {
      const filas = consultasCargadas[tabla]
      if (Array.isArray(filas)) {
        out[tabla] = filas.map(row => {
          const idKey = Object.keys(row).find(k => k.toLowerCase().includes('id'))
          const nombreKey = Object.keys(row).find(k => k.toLowerCase().includes('nombre'))
          return { id: row[idKey], nombre: row[nombreKey] }
        })
      } else {
        out[tabla] = []
      }
    }
    return out
  }, [consultasCargadas])
  useEffect(() => {
    if (!editara) return
    for (const elemento of form) {
      if (elemento.type === 'select' && 'changeTable' in elemento) {
        const padreValue = valores[elemento.id]?.value
        if (
          padreValue &&
          (!opcionesPorTabla[elemento.changeTable.table] || !opcionesPorTabla[elemento.changeTable.table].length)
        ) {
          setValuesChilds(elemento, padreValue)
        }
      }
    }
  }, [editara, form, valores, opcionesPorTabla])

  useEffect(() => {
    if (!editara) return
    for (const elemento of form) {
      if (elemento.type === 'select' && 'changeTable' in elemento) {
        const padreValue = valores[elemento.id]?.value
        const hijoTable = elemento.changeTable.table
        if (
          padreValue &&
          opcionesPorTabla[hijoTable]?.length &&
          datosEdit[hijoTable] &&
          typeof datosEdit[hijoTable] === 'object' &&
          'id' in datosEdit[hijoTable]
        ) {
          const valorEdit = datosEdit[hijoTable].id
          if (valores[hijoTable]?.value !== valorEdit) {
            dispatch({ id: hijoTable, value: valorEdit })
          }
        }
      }
    }
  }, [editara, form, valores, opcionesPorTabla, datosEdit])

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
          sx={{maxWidth: medidas == "movil" ? "90%" : "40%"}}
          type={elemento.typeOf && elemento.typeOf !== '' ? elemento.typeOf : 'string'}
          value={valores[elemento.id].value}
          error={valores[elemento.id].error}
          helperText={valores[elemento.id].helperText}
          onChange={e => handle(e.target.value, 'input', elemento.id)}
          InputLabelProps={{ shrink: Boolean(valores[elemento.id].value) }}
          autoComplete="off"
        />
      )
    }
    if (elemento.type === 'select' && verDependencia(elemento.dependency)) {
      const opciones = opcionesPorTabla[elemento.childs.table] || [];
      let valorSelect = valores[elemento.id]?.value ?? '';
      const existeOpcion = opciones.some(opt => String(opt.id) === String(valorSelect));
      if (!existeOpcion && valorSelect !== '') valorSelect = '';
      return (
        <FormControl key={elemento.id} fullWidth margin="normal" size="small" sx={{ position: 'relative' }}>
          <InputLabel id={`${elemento.id}-label`}>{elemento.label}</InputLabel>
          <Select
            labelId={`${elemento.id}-label`}
            label={elemento.label}
            value={valorSelect}
            onChange={e => {
              if ('changeTable' in elemento) {
                handle("", "select", elemento.changeTable.table);
                setValuesChilds(elemento, e.target.value);
              }
              handle(e.target.value, 'select', elemento.id);
            }}
            variant="filled"
            MenuProps={{
              disablePortal: true,
            }}
            sx={{maxWidth: medidas == "movil" ? "90%" : "40%"}}
          >
            {opciones.map(opt => <MenuItem key={opt.id} value={opt.id}>{opt.nombre}</MenuItem>)}
          </Select>
        </FormControl>
      );
    }
    if (elemento.type === 'img') {
      return (
        <Button
          key={elemento.id}
          component="label"
          sx={{ background: 'rgb(232,248,230)', maxWidth: medidas == "movil" ? "90%" : "40%", height: '90px', mt: 2, position: 'relative', overflow: 'hidden' }}
        >
          <CloudUploadIcon />
          <input type="file" accept="image/*" hidden onChange={e => handle(e.target.files[0], 'img', elemento.id)} />
          {valores[elemento.id].preview ? (
            <Box
              component="img"
              src={valores[elemento.id].preview}
              sx={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'cover', transition: 'opacity 0.2s' }}
              loading="lazy"
            />
          ) : valores[elemento.id].value ? (
            <Box
              component="img"
              src={valores[elemento.id].value}
              sx={{ pointerEvents: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, objectFit: 'cover', transition: 'opacity 0.2s' }}
              loading="lazy"
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
          sx={{ color: 'white', mt: 2, mr: medidas == "movil" ? "auto" : 0, ml: "auto", borderRadius: "30px", height: "40px" }}
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
              padre.setRender(!padre.render)
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
      <Box sx={{height: '100%' ,width: medidas === 'movil' ? '90%' : '98%', ...(editara && { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }) }}>
        <Box sx={{
          position: "relative",
          overflowY: 'auto',
          minHeight: '0px',
          minWidth: '340px',
          display: "flex",
          flexDirection: 'column',
          margin: !editara ? '3.5vh 1%' : '0vh 1% 3.5vh 3%',
          background: 'white',
          width: editara ? '70%' : '100%',
          height: '80vh',
          boxSizing: "border-box",
          padding: "2rem 2rem 2rem 2rem",
          ...(editara && { display: "flex", alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }),
          '&::-webkit-scrollbar': { width: '2.5px' },
          '&::-webkit-scrollbar-thumb': { background: '#7e9e4a', borderRadius: '5px' }
        }}>
          {form == undefined || form.length <= 0 && 
            <Carga />
          }
          <Box sx={{ background: "#7e9e4a", color: 'beige', borderRadius: "10px", minHeight: '4rem', maxHeight: '4rem', display: "flex", justifyContent: 'flex-start', boxSizing: "border-box", ...(!editara ? {paddingLeft: "2rem"}: {px: "1rem"}), alignItems: 'center', flexBasis: '850px', overflow: 'auto' }}>
            <Typography variant="h6" >
              {Array.isArray(form) && form.length > 0 ? form[0].title : ''}
            </Typography>
          </Box>
          <Box className={Style.formulario} sx={{position: "relative", flex: 1, background: 'white', borderRadius: 8, padding: "2rem", boxSizing: "border-box", display: 'flex', flexDirection: 'column', minWidth: "100%" }}>
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