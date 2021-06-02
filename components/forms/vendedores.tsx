import {
    Button,
    Container,
    createStyles,
    IconButton,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Theme,
    Typography,
    Snackbar,
  } from '@material-ui/core';
  import ArrowBackIcon from '@material-ui/icons/ArrowBack';
  import { useFormik } from 'formik';
  import Link from 'next/link';
  import { useRouter } from 'next/router';
  import { useEffect, useState } from 'react';
  import * as Yup from 'yup';
  import Layout from '../screen/layouts/layout';
  import Loading from '../screen/loading/form';

  import {vendedorById, vendedorUpdate, vendedorInsert, vendedorVendas} from '../api/vendedores';
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      toolbar: {
        display: 'flex',
        alignItems: 'center',
      },
      toolbarAux: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(3),
      },
      form: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
      },
      submit: {
        marginTop: theme.spacing(2),
      },
      table: {
        marginTop: theme.spacing(3),
    }
    })
  );
  
  interface IFormData {
    nome?: string;
    email?: string;
    id?: number;
  }

  
  export default function Vendedor() {
    const classes = useStyles();
    const [title, setTitle] = useState('Novo Vendedor');
    const router = useRouter();
    const { id } = router.query;

    const [vendas, setVendas] = useState([]);
  
    const initialValues: IFormData = {
      nome: '',
      email: '',
      id: '',
    }
  
    const formSchema = Yup.object().shape({
      nome: Yup.string()
        .required('Obrigatório')
        .min(2, 'O nome deve ter pelo menos 2 caracteres'),
      email: Yup.string().email('E-mail inválido').required('Obrigatório')
    });
  
    const formik = useFormik({
      initialValues: initialValues,
      validationSchema: formSchema,
      onSubmit: (values) => {
        setTimeout(() => {
          if (id) {
            vendedorUpdate(values).then((row) => {
              setMessageInfo({ show: true, message: row.data.message });
              formik.setSubmitting(false);
            });
          }else{
            vendedorInsert(values).then((row) => {
              setMessageInfo({ show: true, message: row.data.message });
              formik.setSubmitting(false);
            });
          }
        }, 3000);
      },
    });
  
    useEffect(() => {
      if (id) {
        vendedorById(Number(id)).then((row) => {
          setTitle(`Editando o cliente: ${row.nome}`);
          formik.setValues({
            email: row.email,
            nome: row.nome,
            id: row.id,
          });
        });

        vendedorVendas(Number(id)).then((row) => {
          if(row.status === 'warning'){
            setVendas([]);
          }else{
            setVendas(row.vendas);
          }
        });
      }
    }, [id]);

    const [messageInfo, setMessageInfo] = useState<{
      show: boolean;
      message: string;
    }>({ show: false, message: '' });

    const handleCloseMessage = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setMessageInfo({ show: false, message: '' });
    };
  
    return (
      <Layout>
        <Container>
          <div className={classes.toolbar}>
            <Link href="/vendedores" passHref>
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
                id="nome"
                label="Nome"
                name="nome"
                autoComplete="nome"
                autoFocus
                onChange={formik.handleChange}
                value={formik.values.nome}
                error={formik.touched.nome && Boolean(formik.errors.nome)}
                helperText={formik.touched.nome && formik.errors.nome}
              />
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="email"
                label="E-mail"
                name="email"
                autoComplete="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
  
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
        <Container>
          <div className={classes.toolbarAux}>
            <Typography component="h1" variant="h5">
              Vendas
            </Typography>
          </div>
          <TableContainer component={Paper} className={classes.table}>
              <Table aria-label="Clientes">
                  <TableHead>
                      <TableRow>
                      <TableCell>Valor</TableCell>
                      <TableCell>Comissão %</TableCell>
                      <TableCell>Valor Comissão</TableCell>
                      <TableCell width="140" align="center">
                      </TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {vendas.map((row) => (
                      <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                          {row.valor}
                          </TableCell>
                          <TableCell>{row.comissao}</TableCell>
                          <TableCell>{row.valor * row.comissao / 100}</TableCell>
                          <TableCell></TableCell>
                      </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
        </Container>
        <Snackbar
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              autoHideDuration={3000}
              open={messageInfo.show}
              message={messageInfo.message}
              key={messageInfo.message}
              onClose={handleCloseMessage}
          />    
      </Layout>
    );
  }