export const vendedoresList = async() => {
    const res = await fetch('http://127.0.0.1/teste/vendedor')
    const data = await res.json()
  
    return data
}

export const vendedorById = async(id: number) => {
    const res = await fetch('http://127.0.0.1/teste/vendedor/' + id)
    const data = await res.json()
  
    return data
}

export const vendedorUpdate = async(item: any) => {

    let formData = new FormData();
    formData.append('nome', item.nome);
    formData.append('email', item.email);
    formData.append('id', item.id);

    const res = await fetch('http://127.0.0.1/teste/vendedor/' + item.id, {
        method: 'PUT',
        body: formData
    })

    const data = await res.json()
    return data
}

export const vendedorInsert = async(item: any) => {

    let formData = new FormData();
    formData.append('nome', item.nome);
    formData.append('email', item.email);

    const res = await fetch('http://127.0.0.1/teste/vendedor', {
        method: 'POST',
        body: formData
    })

    const data = await res.json()
    return data
}

export const vendedorDelete = async(id: number) => {

    let formData = new FormData();
    formData.append('id', id);

    const res = await fetch('http://127.0.0.1/teste/vendedor', {
        method: 'DELETE',
        body: formData
    })

    const data = await res.json()
    return data
}

export const vendedorVendas = async(id: number) => {
    const res = await fetch('http://127.0.0.1/teste/vendedor/' + id + '/vendas/')
    const data = await res.json()
  
    return data
}