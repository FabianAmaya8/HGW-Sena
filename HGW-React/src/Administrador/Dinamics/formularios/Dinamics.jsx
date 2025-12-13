import {
  InputLabel, Slide, Box, TextField, Select, Button, FormControl, MenuItem, Typography,
  Autocomplete, InputAdornment, IconButton
} from '@mui/material'
import {
  useState, useEffect, useRef, useReducer, useCallback, memo, useMemo, useContext
} from 'react'
import { AppContext } from '../../../controlador'
import "../../../font.module.scss"
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Carga from '../../intermedias/carga'
import Style from './Dinamics.module.scss'
import { findWorkingBaseUrl } from '../../../urlDB'
import { datosToken } from '../../../auth'

const BACKEND = findWorkingBaseUrl().replace(/\/$/, "");
const usuarioActual = (datosToken()?.id);
const token = datosToken();

import { Visibility, VisibilityOff } from '@mui/icons-material'

const PasswordField = memo(function PasswordField({
  id,
  label,
  value,
  error,
  helperText,
  onChange,
  sx
}) {
  const [visible, setVisible] = useState(false)
  const handleMouseDown = useCallback(e => e.preventDefault(), [])
  return (
    <TextField
      id={id}
      label={label}
      variant="standard"
      fullWidth
      margin="normal"
      sx={sx}
      type={visible ? 'text' : 'password'}
      value={typeof value === 'object' ? (value.text ?? '') : (value ?? '')}
      error={Boolean(error)}
      helperText={helperText}
      onChange={onChange}
      InputLabelProps={{ shrink: Boolean(typeof value === 'object' ? value.text : value) }}
      autoComplete="off"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={() => setVisible(v => !v)}
              onMouseDown={handleMouseDown}
              edge="end"
            >
              {visible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
})

const useConsultas = (initial, payload) => {
  const [data, setData] = useState(initial)
  useEffect(() => {
    if (!payload) return
    const c = new AbortController()
    fetch(`${BACKEND}/consultas`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: c.signal
    })
      .then(r => r.json())
      .then(setData)
      .catch(() => { })
    return () => c.abort()
  }, [payload])
  return [data, setData]
}

const asignarValores = (state, action) => {
  if (action.type === 'RESET') return action.objeto
  if (action.error !== undefined) {
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        error: action.error,
        helperText: action.helperText || ''
      }
    }
  }
  if (action.tipo === 'img') {
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        value: action.value,
        ...(action.preview !== undefined && { preview: action.preview })
      }
    }
  }
  if (action.tipo === 'input') {
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        value: action
      }
    }
  }
  if (action.value !== undefined) {
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        value: action.value
      }
    }
  }
  return state
}

const FieldInput = memo(function FieldInput({ el, campo, valObj, medidas, handle }) {
  return (
    <TextField
      key={el.id}
      id={el.id}
      label={el.label}
      variant="standard"
      fullWidth
      margin="normal"
      sx={{ maxWidth: medidas === 'movil' ? '90%' : '40%' }}
      type={el.typeOf || 'string'}
      value={typeof valObj === 'object' ? (valObj.text ?? '') : (valObj ?? '')}
      error={Boolean(campo.error)}
      helperText={campo.helperText ?? ''}
      onChange={e => handle({ text: e.target.value }, 'input', el.id)}
      InputLabelProps={{
        shrink: Boolean(typeof valObj === 'object' ? valObj.text : valObj)
      }}
      autoComplete="off"
    />
  )
})

const FieldPassword = memo(function FieldPassword({ el, campo, valObj, medidas, handle }) {
  return (
    <PasswordField
      key={el.id}
      id={el.id}
      label={el.label}
      value={valObj}
      error={campo.error}
      helperText={campo.helperText}
      onChange={e => handle({ text: e.target.value, password: true }, 'input', el.id)}
      sx={{ maxWidth: medidas === 'movil' ? '90%' : '40%' }}
    />
  )
})

const FieldSelect = memo(function FieldSelect({ el, campo, opciones, editara, datosEdit, setValuesChilds, handle, medidas }) {
  const keyTabla = el.childs?.table
  const opts = opciones[keyTabla] || []
  if (opts.length >= 4) {
    let val = campo.value ?? ''
    if (editara && !val) {
      const dv = datosEdit[el.id]?.id ?? ''
      if (dv) val = dv
    }
    if (!opts.some(o => String(o.id) === String(val))) val = ''
    return (
      <Autocomplete
        options={opts}
        getOptionLabel={(opt) => opt.nombre}
        value={opts.find(o => String(o.id) === String(val)) || null}
        onChange={(e, newValue) => {
          const nuevoId = newValue?.id ?? ''
          if (el.changeTable) {
            handle('', 'select', el.changeTable.table)
            setValuesChilds(el, nuevoId)
          }
          handle(nuevoId, 'select', el.id)
        }}
        renderInput={(params) => (
          <TextField {...params} label={el.label} variant="filled" />
        )}
        key={el.id}
        fullWidth
        margin="normal"
        size="small"
        sx={{ position: 'relative', maxWidth: medidas === 'movil' ? '90%' : '40%' }}
      />
    )
  }
  let val = campo.value ?? ''
  if (editara && !val) {
    const dv = datosEdit[el.id]?.id ?? ''
    if (dv) val = dv
  }
  if (!opts.some(o => String(o.id) === String(val))) val = ''
  return (
    <FormControl
      key={el.id}
      fullWidth
      margin="normal"
      size="small"
      sx={{ position: 'relative', maxWidth: medidas === 'movil' ? '90%' : '40%' }}
    >
      <InputLabel id={`${el.id}-label`}>{el.label}</InputLabel>
      <Select
        labelId={`${el.id}-label`}
        label={el.label}
        value={val}
        variant="filled"
        MenuProps={{ disablePortal: true }}
        onChange={e => {
          if (el.changeTable) {
            handle('', 'select', el.changeTable.table)
            setValuesChilds(el, e.target.value)
          }
          handle(e.target.value, 'select', el.id)
        }}
      >
        {opts.map((o, index) => (
          <MenuItem key={o.id + index} value={o.id}>
            {o.nombre}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
})

const FieldImg = memo(function FieldImg({ el, campo, medidas, handle }) {
  const previewUrl = campo.preview || campo.value || ''
  return (
    <Button
      key={el.id}
      component="label"
      sx={{
        background: 'rgb(232,248,230)',
        maxWidth: medidas === 'movil' ? '90%' : '40%',
        minWidth: medidas === 'movil' ? '90%' : '40%',
        height: 90,
        mt: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CloudUploadIcon />
      <input type="file" accept="image/*" hidden onChange={e => handle(e.target.files?.[0], 'img', el.id)} />
      {previewUrl && (
        <Box
          component="img"
          src={previewUrl}
          sx={{
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            objectFit: 'cover',
            transition: 'opacity 0.2s'
          }}
          loading="lazy"
        />
      )}
    </Button>
  )
})

const FieldSubmit = memo(function FieldSubmit({ el, envio, medidas }) {
  return (
    <Button
      key="submit"
      variant={el.variant}
      sx={{
        mt: 2,
        mr: medidas === 'movil' ? 'auto' : 0,
        ml: 'auto',
        borderRadius: 30,
        height: 40,
      }}
      onClick={envio}
    >
      {el.label}
    </Button>
  )
})

const Form = memo(({ form, consultas, edit, padre, alerta }) => {
  const editara = !!edit?.estado
  const datosEdit = edit?.datos || {}
  const { medidas } = useContext(AppContext)
  const [consultasCargadas, setConsultasCargadas] = useConsultas({}, consultas)

  const previewUrlsRef = useRef(new Set())

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach(u => {
        try { URL.revokeObjectURL(u) } catch (e) { }
      })
      previewUrlsRef.current.clear()
    }
  }, [])

  const normalizaUrlImagen = useCallback(v => {
    if (!v) return ''
    return v
  }, [])

  const crearObjeto = useCallback(datos => {
    const res = editara ? {editor: {
      value: token?.id ?? '',
      error: false,
      helperText: '',
      id: 'editor'
    }}
    : {creador: {
      value: token?.id ?? '',
      error: false,
      helperText: '',
      id: 'creador'
    }}
    for (const e of datos) {
      if (!e.id) continue
      let val = ''
      if (editara) {
        if (e.type === 'img') {
          const fn = datosEdit[e.id]
          if (typeof fn === 'string' && fn) {
            const url = normalizaUrlImagen(fn)
            res[e.id] = { value: url, preview: url, error: false, helperText: '', id: e.id }
            continue
          }
        } else if (e.type === 'select') {
          val = datosEdit[e.id]?.id || ''
        } else val = datosEdit[e.id] ?? ''
      }
      res[e.id] = {
        value: e.type === 'input'
          ? { text: val, ...(e.typeOf === 'password' && { password: true }) }
          : val,
        error: false,
        helperText: '',
        id: e.id
      }
    }
    return res
  }, [editara, datosEdit, normalizaUrlImagen])

  const [valores, dispatch] = useReducer(asignarValores, form, crearObjeto)
  const valoresRef = useRef(valores)
  useEffect(() => { valoresRef.current = valores }, [valores])

  useEffect(() => {
    if (editara) dispatch({ type: 'RESET', objeto: crearObjeto(form) })
  }, [editara, datosEdit, crearObjeto, form])

  const setValuesChilds = useCallback(async (el, padreVal, reset) => {
    try {
      const r = await fetch(`${BACKEND}/consultas`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          table: el.changeTable.table,
          columnDependency: el.changeTable.columnDependency,
          foreign: padreVal
        })
      })
      const j = await r.json()
      setConsultasCargadas(p => ({ ...p, ...j }))
      const t = el.changeTable.table
      const opts = Object.values(j)[0] || []
      if (reset) {
        dispatch({ id: t, value: '' })
        return
      }
      const cur = valoresRef.current[t]?.value
      if (opts.some(o => String(o.id) === String(cur)))
        dispatch({ id: t, value: cur })
      else {
        const dv = datosEdit[t]?.id ?? ''
        dispatch({ id: t, value: opts.some(o => String(o.id) === String(dv)) ? dv : '' })
      }
    } catch (e) { }
  }, [datosEdit, setConsultasCargadas])

  const verDep = useCallback(d => {
    if (!d) return true
    const v = valores[d.elemento]?.value
    return v !== '' && v !== 0 && v != null
  }, [valores])

  const handle = useCallback((e, tipo, id) => {
    if (tipo === 'input') dispatch({ id, ...e, tipo: 'input' })
    else if (tipo === 'img') {
      if (!e) return
      const preview = URL.createObjectURL(e)
      previewUrlsRef.current.add(preview)
      dispatch({ id, value: e, preview, tipo: 'img' })
    } else dispatch({ id, value: e })
  }, [])

  const opcionesPorTabla = useMemo(() => {
    const o = {}
    for (const [k, v] of Object.entries(consultasCargadas)) {
      o[k] = Array.isArray(v)
        ? v.map(r => {
          const ik = Object.keys(r).find(x => x.toLowerCase().includes('id'))
          const nk = Object.keys(r).find(x => x.toLowerCase().includes('nombre'))
          return { id: r[ik], nombre: r[nk] }
        })
        : []
    }
    return o
  }, [consultasCargadas])

  const subKey = useMemo(() => form.find(f => f.id === 'subcategoria')?.id, [form])
  useEffect(() => {
    if (!editara) return
    const opts = opcionesPorTabla[subKey] || []
    const dv = datosEdit[subKey]?.id
    if (opts.length && dv != null && String(dv) !== '') {
      dispatch({ id: subKey, value: dv })
    }
  }, [opcionesPorTabla, editara, datosEdit, subKey])

  const validaciones = useCallback((datos, h, form) => {
    let ok = true;
    form.forEach(f => {
      if (f.id) h({ id: f.id, error: false, helperText: '' });
    });
    for (const f of form) {
      if (!f.id) continue;
      if (f.type === 'img') {
        const min = f.requirements?.minLength ?? 0;
        if (min > 0) {
          const val = datos[f.id]?.value;
          const hasFile = val instanceof File;
          const hasUrl = typeof val === 'string' && val.trim() !== '';
          if (!hasFile && !hasUrl) {
            ok = false;
            h({
              id: f.id,
              error: true,
              helperText: `Debe cargar al menos ${min} imagen${min > 1 ? 'es' : ''}`
            });
          }
        }
        continue;
      }
      if (f.type === 'select') {
        const min = f.requirements?.minLength ?? 1;
        const raw = datos[f.id]?.value;
        const v = String(raw ?? '').trim();
        if (v.length < min) {
          ok = false;
          h({
            id: f.id,
            error: true,
            helperText: f.requirements
              ? `debe tener entre ${min} y ${f.requirements.maxLength ?? '∞'} caracteres`
              : 'Seleccione una opción'
          });
        }
        continue;
      }
      let raw = datos[f.id]?.value;
      if (typeof raw === 'object') raw = raw.text ?? '';
      const v = String(raw).trim();
      const { minLength = 0, maxLength = Infinity, value: mustInclude } = f.requirements || {};

      if (v.length < minLength || v.length > maxLength) {
        ok = false;
        h({
          id: f.id,
          error: true,
          helperText: `debe tener entre ${minLength} y ${maxLength} caracteres`
        });
        continue;
      }

      if (Array.isArray(mustInclude) && mustInclude.length) {
        const falt = mustInclude.filter(x => !v.includes(x));
        if (falt.length) {
          ok = false;
          h({
            id: f.id,
            error: true,
            helperText: 'Debe contener: ' + falt.join(', ')
          });
        }
      }
    }

    return ok;
  }, [])

  useEffect(() => {
    if (!editara) return
    for (const e of form) {
      if (e.type === 'select' && e.changeTable) {
        const pv = valores[e.id]?.value
        if (pv && !opcionesPorTabla[e.changeTable.table]?.length) {
          setValuesChilds(e, pv)
        }
      }
    }
  }, [editara, form, opcionesPorTabla, setValuesChilds, valores])

  const envio = useCallback(async () => {
    if (editara) edit.setClick(false);
    if (!validaciones(valores, dispatch, form)) return;
    const payload = new FormData();
    Object.entries(valoresRef.current).forEach(([k, c]) => {
      if (k === 'rol' && (c.value === '' || c.value == null)) return;
      if (c.value instanceof File) payload.append(k, c.value);
      else if (typeof c.value === 'object') payload.append(k, JSON.stringify(c.value));
      else payload.append(k, String(c.value));
    });
    payload.append('table', form[0].req.table);
    const idKey = Object.keys(datosEdit).find(k => /(^|_)id($|_)/i.test(k));
    if (editara && idKey) {
      const idValor = typeof datosEdit[idKey] === "object"
        ? datosEdit[idKey].id
        : datosEdit[idKey];
      payload.append('id', String(idValor));
    }
    dispatch({ type: 'RESET', objeto: valoresRef.current });
    const url = editara ? `${BACKEND}/editar` : `${BACKEND}/registro`;
    payload.append("log", JSON.stringify({id: usuarioActual, accion: editara ? "editar" : "crear"}))
    try {
      const res = await fetch(url, { method: 'POST', body: payload });
      const json = await res.json();
      if (json.uploaded) {
        Object.entries(json.uploaded).forEach(([cid, fn]) =>
          dispatch({ id: cid, value: `${BACKEND}/images/${fn}` })
        );
      }
      alerta.setAlerta({
        estado: true,
        valor: { title: 'Completado', content: json.respuesta },
        ...(editara && { lado: 'izquierdo' })
      });
      if (editara) padre.setRender(r => !r);
    } catch (e) { }
  }, [validaciones, form, editara, datosEdit, padre, alerta, edit])

  useEffect(() => {
    if (edit.click) envio()
  }, [edit.click, envio])

  const opcionesMemo = useMemo(() => opcionesPorTabla, [opcionesPorTabla])
  const formMemo = useMemo(() => form, [form])
  const valoresMemo = useMemo(() => valores, [valores])
  const datosEditMemo = useMemo(() => datosEdit, [datosEdit])

  const renderCampos = useMemo(() => formMemo.map(el => {
    const campo = valoresMemo[el.id] || {}
    const valObj = campo.value || {}

    if (el.type === 'input' && verDep(el.dependency)) {
      if (el.typeOf === 'password') {
        return <FieldPassword key={el.id} el={el} campo={campo} valObj={valObj} medidas={medidas} handle={handle} />
      }
      return <FieldInput key={el.id} el={el} campo={campo} valObj={valObj} medidas={medidas} handle={handle} />
    }

    if (el.type === 'select' && verDep(el.dependency)) {
      return <FieldSelect
        key={el.id}
        el={el}
        campo={campo}
        opciones={opcionesMemo}
        editara={editara}
        datosEdit={datosEditMemo}
        setValuesChilds={setValuesChilds}
        handle={handle}
        medidas={medidas}
      />
    }

    if (el.type === 'img') {
      return <FieldImg key={el.id} el={el} campo={campo} medidas={medidas} handle={handle} />
    }

    if (el.type === 'submit' && !editara) {
      return <FieldSubmit key="submit" el={el} envio={envio} medidas={medidas} />
    }

    return null
  }), [formMemo, opcionesMemo, valoresMemo, handle, verDep, editara, medidas, setValuesChilds, datosEditMemo, envio])

  return (
    <Slide in direction="left" timeout={400}>
      <Box
        sx={{
          height: '100%',
          width: medidas === 'movil' ? '90%' : '98%',
          ...(editara && {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          })
        }}
      >
        <Box
          sx={{
            position: 'relative',
            overflowY: 'auto',
            minHeight: 0,
            minWidth: 340,
            display: 'flex',
            flexDirection: 'column',
            margin: !editara ? '3.5vh 1%' : '0vh 1% 3.5vh 3%',
            background: 'white',
            width: editara ? '70%' : '100%',
            height: '80vh',
            boxSizing: 'border-box',
            padding: '2rem',
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.08)",
            ...(editara && { boxShadow: '0 2px 8px rgba(0,0,0,0.1)', alignItems: 'center' }),
            '&::-webkit-scrollbar': { width: '2.5px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'barra.main', borderRadius: 5 }
          }}
        >
          {(!form || !form.length) && <Carga />}
          {(!editara && medidas !== 'movil') || medidas === 'movil' ? (
            <Box
              sx={{
                background: '#29293D',
                color: 'beige',
                borderRadius: 2,
                minHeight: 64,
                maxHeight: 64,
                justifyContent: 'flex-start',
                display: 'flex',
                ...(!editara && medidas !== 'movil'
                  ? { paddingLeft: '2rem' }
                  : { justifyContent: 'center', px: '1rem' }),
                alignItems: 'center',
                flexBasis: 850,
                overflow: 'auto'
              }}
            >
              <Typography variant="h6">
                {Array.isArray(form) && form.length
                  ? editara
                    ? form[0].title[0]
                    : form[0].title[1]
                  : ''}
              </Typography>
            </Box>
          ) : null}
          <Box
            className={Style.formulario}
            sx={{
              position: 'relative',
              flex: 1,
              background: 'white',
              borderRadius: 2,
              padding: '2rem',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              minWidth: '100%',
              ...(editara && { alignItems: 'center', justifyContent: 'flex-start' })
            }}
          >
            {renderCampos}
          </Box>
        </Box>
      </Box>
    </Slide>
  )
})

const DinamicForm = memo(({ form, consultas, edit, padre }) => {
  const editara = !!edit?.estado
  const { medidas, anchoDrawer, alerta } = useContext(AppContext)
  const contenidoWidth = useMemo(
    () =>
      anchoDrawer.isOpen
        ? `calc(100% - ${anchoDrawer.ancho.open - 15}rem)`
        : `calc(100% - ${anchoDrawer.ancho.close - 4}rem)`,
    [anchoDrawer.isOpen, anchoDrawer.ancho.open, anchoDrawer.ancho.close]
  )
  return (
    <Box
      className="box-contenidos"
      sx={{
        width: medidas === 'movil' || editara ? '100%' : contenidoWidth,
        right: medidas == 'movil' ? editara ? "0.09rem" : "0.25rem" : "1.1rem",
        transition: '450ms',
      }}
    >
      <Form form={form} consultas={consultas} edit={edit || {}} padre={padre} alerta={alerta} />
    </Box>
  )
})

export default DinamicForm
