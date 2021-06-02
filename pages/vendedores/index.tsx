import { Typography, 
        Button, 
        makeStyles, 
        Theme, 
        createStyles, 
        Table,
        TableBody,
        TableCell,
        TableContainer,
        TableHead,
        TableRow,
        Paper,
        IconButton,
        Snackbar} from '@material-ui/core';
import React, {useEffect, useState} from 'react'
import Layout from '../../components/screen/layouts/layout'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Delete, Edit } from '@material-ui/icons'
import ConfirmationDialog from '../../components/screen/dialog/confirmation'

import {vendedoresList, vendedorDelete} from '../../components/api/vendedores'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        bar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        table: {
            marginTop: theme.spacing(3),
        },
    })
);

export default function Vendedores(){

    const [vendedores, setVendedores] = useState([]);
    const router = useRouter();

    useEffect(()=>{
        const Load = async() =>{
            const vendedores = await vendedoresList();
            
            if(vendedores.status === 'warning'){
                setVendedores([]);
            }else{
                setVendedores(vendedores);
            }
        }
        Load();
    },[])

    const classes = useStyles();

    const [deleteOptions, setDeleteOptions] = useState<{
        show: boolean;
        itemId?: number;
        itemDescription?: string;
      }>({ show: false });
    
      const [messageInfo, setMessageInfo] = useState<{
        show: boolean;
        message: string;
      }>({ show: false, message: '' });
    
      const handleDelete = (item: any) => {
        setDeleteOptions({
          show: true,
          itemId: item.id,
          itemDescription: item.nome,
        });
      };
    
      const handleDeleteCallBack = (value: string) => {
        const { itemId } = deleteOptions;
        setDeleteOptions({ show: false, itemId: null, itemDescription: null });
    
        if (value === 'ok') {
            setTimeout(() => {
                if (itemId) {
                    vendedorDelete(itemId).then((row) => {
                        setMessageInfo({ show: true, message: row.data.message });
                        setTimeout(() => {
                            router.reload(window.location.pathname);
                        }, 2000);
                    });
                }
            }, 3000);
        }
      };
    
      const handleCloseMessage = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        setMessageInfo({ show: false, message: '' });
      };

    return (    
                <Layout>
                    <div className={classes.bar}>
                        <div>
                            <Typography component="h1" variant="h4">
                                Vendedores
                            </Typography>
                        </div>
                        <div>
                            <Link href="/vendedores/new" passHref>
                                <Button variant="contained" color="primary">
                                    Novo
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <TableContainer component={Paper} className={classes.table}>
                        <Table aria-label="Clientes">
                            <TableHead>
                                <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>E-mail</TableCell>
                                <TableCell width="140" align="center">
                                    Ações
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vendedores.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                    {row.nome}
                                    </TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>
                                    <IconButton
                                        aria-label="delete"
                                        onClick={() => handleDelete(row)}
                                    >
                                        <Delete />
                                    </IconButton>
                                    <Link href={`/vendedores/edit/${row.id}`} passHref>
                                        <IconButton aria-label="edit">
                                        <Edit />
                                        </IconButton>
                                    </Link>
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ConfirmationDialog
                        id={`delete-${deleteOptions.itemId}`}
                        title="Excluir"
                        confirmButtonText="Excluir"
                        keepMounted
                        open={deleteOptions.show}
                        onClose={handleDeleteCallBack}
                    >
                        Confirma a exclusão do vendedor{' '}
                        <strong>{deleteOptions.itemDescription}</strong>
                    </ConfirmationDialog>
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