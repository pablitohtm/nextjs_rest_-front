export const vendasList = async() => {
    const res = await fetch('http://127.0.0.1/teste/venda')
    const data = await res.json()
  
    return data
}

export const vendaById = async(id: number) => {
    const res = await fetch('http://127.0.0.1/teste/venda/' + id)
    const data = await res.json()
  
    return data
}

export const vendaUpdate = async(item: any) => {

    let formData = new FormData();
    formData.append('valor', item.valor);
    formData.append('comissao', item.comissao);
    formData.append('vendedor_id', item.vendedor_id);
    formData.append('id', item.id);

    const res = await fetch('http://127.0.0.1/teste/venda/' + item.id, {
        method: 'PUT',
        body: formData
    })

    const data = await res.json()
    return data
}

export const vendaInsert = async(item: any) => {

    let formData = new FormData();
    formData.append('valor', item.valor);
    formData.append('comissao', item.comissao);
    formData.append('vendedor_id', item.vendedor_id);

    const res = await fetch('http://127.0.0.1/teste/venda', {
        method: 'POST',
        body: formData
    })

    const data = await res.json()
    return data
}

export const vendaDelete = async(id: number) => {

    let formData = new FormData();
    formData.append('id', id);

    const res = await fetch('http://127.0.0.1/teste/venda', {
        method: 'DELETE',
        body: formData
    })

    const data = await res.json()
    return data
}