import {
    Button,
    Container,
    createStyles,
    IconButton,
    makeStyles,
    Paper,
    TextField,
    Theme,
    Typography,
    Snackbar,
    Select,
    MenuItem, 
  } from '@material-ui/core';
  import ArrowBackIcon from '@material-ui/icons/ArrowBack';
  import { useFormik } from 'formik';
  import Link from 'next/link';
  import { useRouter } from 'next/router';
  import { useEffect, useState } from 'react';
  import * as Yup from 'yup';
  import Layout from '../screen/layouts/layout';
  import Loading from '../screen/loading/form';

  import {vendaById, vendaUpdate, vendaInsert} from '../api/vendas';
  import {vendedoresList} from '../api/vendedores'
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      toolbar: {
        display: 'flex',
        alignItems: 'center',
      },
      form: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
      },
      submit: {
        marginTop: theme.spacing(2),
      },
    })
  );
  
  interface IFormData {
    valor?: string;
    comissao?: string;
    vendedor_id?: string;
    id?: number;
  }

  
  export default function Venda() {

    const classes = useStyles();
    const [title, setTitle] = useState('Nova Venda');
    const router = useRouter();
    const { id } = router.query;
    const [vendedores, setVendedores] = useState([]);

    const initialValues: IFormData = {
      valor: '',
      comissao: '',
      vendedor_id: '',
      id: '',
    }
  
    const formSchema = Yup.object().shape({
      valor: Yup.string().required('Obrigatório'),
      comissao: Yup.string().required('Obrigatório'),
      vendedor_id: Yup.string().required('Obrigatório')
    });
  
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: formSchema,
      onSubmit: (values) => {
        console.log(values);
        setTimeout(() => {
          if (id) {
            vendaUpdate(values).then((row) => {
              setMessageInfo({ show: true, message: row.data.message });
              formik.setSubmitting(false);
            });
          }else{
            vendaInsert(values).then((row) => {
              setMessageInfo({ show: true, message: row.data.message });
              formik.setSubmitting(false);
            });
          }
        }, 3000);
      },
    });
  
    useEffect(() => {
      if (id) {
        vendaById(Number(id)).then((row) => {
          setTitle(`Editando a venda: ${row.id}`);
          formik.setValues({
            valor: row.valor,
            comissao: row.comissao,
            vendedor_id: row.vendedor_id,
            id: row.id,
          });
        });
      }

      vendedoresList().then((row) => {
        setVendedores(row);
      });

    }, [id]);

    const [messageInfo, setMessageInfo] = useState<{
      show: boolean;
      message: string;
    }>({ show: false, message: '' });

  
    return (
      <Layout>
        <Container>
          <div className={classes.toolbar}>
            <Link href="/vendas" passHref>
              <IconButton aria-label="Voltar">
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography component="h1" variant="h4">
              {title}
            </Typography>
          </div>
  
          <Paper className={classes.form} elevation={3}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="valor"
                label="Valor"
                name="valor"
                autoComplete="valor"
                autoFocus
                onChange={formik.handleChange}
                value={formik.values.valor}
                error={formik.touched.valor && Boolean(formik.errors.valor)}
                helperText={formik.touched.valor && formik.errors.valor}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="comissao"
                label="Comissão %"
                name="comissao"
                autoComplete="comissao"
                autoFocus
                onChange={formik.handleChange}
                value={formik.values.comissao}
                error={formik.touched.comissao && Boolean(formik.errors.comissao)}
                helperText={formik.touched.comissao && formik.errors.comissao}
              />

              <Select 
                variant="outlined"
                fullWidth
                id="vendedor_id"
                label="Vendedor"
                name="vendedor_id"
                autoComplete="vendedor_id"
                onChange={formik.handleChange}
                value={formik.values.vendedor_id}
                error={formik.touched.vendedor_id && Boolean(formik.errors.vendedor_id)}>
                <MenuItem value="">Selecione</MenuItem>
                  {vendedores.map((row) => (  
                    <MenuItem key={row.id} value={row.id} >{row.nome}</MenuItem>
                  ))}
              </Select>

              <Button
                className={classes.submit}
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
              >
                Salvar
              </Button>
              {formik.isSubmitting && <Loading />}
            </form>
          </Paper>
        </Container>
        <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              autoHideDuration={3000}
              open={messageInfo.show}
              message={messageInfo.message}
              key={messageInfo.message}
          />    
      </Layout>
    );
  }