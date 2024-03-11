import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const CadastroLocacoes = () => {
    // States
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [locacoes, setLocacoes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [tipoLocacao, setTipoLocacao] = useState(null);
    const [valorMensal, setValorMensal] = useState(null);
    const [valorFicha, setValorFicha] = useState(null);
    const [clienteLocacoesVisivel, setClienteLocacoesVisivel] = useState(null);

    // Load data from local storage
    useEffect(() => {
        const db_clientes = localStorage.getItem("cad_cliente")
            ? JSON.parse(localStorage.getItem("cad_cliente"))
            : [];
        setClientes(db_clientes);

        const db_produtos = localStorage.getItem("cad_produto")
            ? JSON.parse(localStorage.getItem("cad_produto"))
            : [];
        setProdutos(db_produtos);

        const db_locacoes = localStorage.getItem("locacoes")
            ? JSON.parse(localStorage.getItem("locacoes"))
            : [];
        setLocacoes(db_locacoes);
    }, []);

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        const cliente = clientes.find(cliente => cliente.cpf === clienteSelecionado.value);
        const produto = produtos.find(produto => produto.productId === produtoSelecionado.value);

        const isProdutoLocado = locacoes.some(locacao => locacao.produto.productId === produto.productId);

        if (isProdutoLocado) {
            alert('Este produto já está alugado.');
            return;
        }

        const novaLocacao = {
            cliente,
            produto,
            tipoLocacao,
            valor: tipoLocacao === 'Mensal' ? valorMensal : valorFicha,
        };

        const updatedLocacoes = [...locacoes, novaLocacao];
        setLocacoes(updatedLocacoes);
        localStorage.setItem("locacoes", JSON.stringify(updatedLocacoes));

        setClienteSelecionado(null);
        setProdutoSelecionado(null);
        setTipoLocacao(null);
        setValorMensal(null);
        setValorFicha(null);
    };

    // Handle product deregistration
    const handleDescadastrar = (produtoId) => {
        const updatedLocacoes = locacoes.filter(locacao => locacao.produto.productId !== produtoId);
        setLocacoes(updatedLocacoes);
        localStorage.setItem("locacoes", JSON.stringify(updatedLocacoes));

        const updatedProdutos = produtos.map(produto => {
            if (produto.productId === produtoId) {
                return {...produto, locado: false};
            } else {
                return produto;
            }
        });
        setProdutos(updatedProdutos);
        localStorage.setItem("produtos", JSON.stringify(updatedProdutos));
    };

    // Handle client click
    const handleClienteClick = (clienteName) => {
        if (clienteLocacoesVisivel === clienteName) {
            setClienteLocacoesVisivel(null);
        } else {
            setClienteLocacoesVisivel(clienteName);
        }
    }

    // Group rentals
    const locacoesAgrupadas = locacoes.reduce((acc, locacao) => {
        const clienteName = locacao.cliente.name;
        if (!acc[clienteName]) {
            acc[clienteName] = [];
        }
        acc[clienteName].push(locacao);
        return acc;
    }, {});

return (
  <Tabs>
    <TabList>
      <Tab>Cadastro</Tab>
      <Tab>Locações Cadastradas</Tab>
    </TabList>

    <TabPanels>
      <TabPanel>
        <form onSubmit={handleSubmit}>
          <Select
            value={clienteSelecionado}
            onChange={setClienteSelecionado}
            options={clientes.map(cliente => ({ value: cliente.cpf, label: cliente.name }))}
            placeholder="Qual é o Cliente?"
          />

          <Select
            value={produtoSelecionado}
            onChange={setProdutoSelecionado}
            options={produtos.filter(produto => !locacoes.some(locacao => locacao.produto.productId === produto.productId))
              .map(produto => ({ value: produto.productId, label: produto.productId }))}
            placeholder="Qual o número do Produto?..."
          />

          <table style={{ borderSpacing: '10px' }}>
            <tr>
              <td style={{ border: '1px solid black', padding: '10px' }}>
                <label>
                  <input
                    type="radio"
                    value="Mensal"
                    checked={tipoLocacao === 'Mensal'}
                    onChange={e => setTipoLocacao(e.target.value)}
                  />
                  Mensal
                </label>
              </td>

              <td style={{ border: '1px solid black', padding: '10px' }}>
                <label>
                  <input
                    type="radio"
                    value="Porcentagem"
                    checked={tipoLocacao === 'Porcentagem'}
                    onChange={e => setTipoLocacao(e.target.value)}
                  />
                  Porcentagem
                </label>
              </td>

              {tipoLocacao === 'Mensal' && (
                <td style={{ border: '0px solid black', padding: '10px' }}>
                  <input
                    type="number"
                    value={valorMensal}
                    onChange={e => setValorMensal(e.target.value)}
                    placeholder="Valor Mensal"
                  />
                </td>
              )}

              {tipoLocacao === 'Porcentagem' && (
                <td style={{ border: '0px solid black', padding: '10px' }}>
                  <input
                    type="number"
                    value={valorFicha}
                    onChange={e => setValorFicha(e.target.value)}
                    placeholder="Valor Ficha"
                  />
                </td>
              )}
            </tr>
          </table>

          <Button colorScheme="green" type="submit">Cadastrar locação</Button>
        </form>
      </TabPanel>

      <TabPanel>
        {Object.entries(locacoesAgrupadas).map(([clienteName, locacoesCliente]) => (
          <div key={clienteName}>
            <h3 onClick={() => handleClienteClick(clienteName)}>{clienteName}</h3>

            {clienteLocacoesVisivel === clienteName && (
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Tipo de Locação</th>
                    <th>Valor</th>
                  </tr>
                </thead>

                <tbody>
                  {locacoesCliente.map((locacao, index) => (
                    <tr key={index}>
                      <td>{locacao.produto.productId}</td>
                      <td>{locacao.tipoLocacao}</td>
                      <td>{locacao.valor}</td>
                      <td>
                      <Button colorScheme="red" onClick={() => {
  if(window.confirm('Tem certeza que deseja enviar este produto para o estoque?')) {
    handleDescadastrar(locacao.produto.productId)
  }
}}>Enviar para Estoque</Button>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </TabPanel>
    </TabPanels>
  </Tabs>
);
}
export default CadastroLocacoes;