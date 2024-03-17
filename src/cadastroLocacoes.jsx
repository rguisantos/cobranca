import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';

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
    const [valorPorcentagem, setvalorPorcentagem] = useState(null);
    // Load data from Firebase
    useEffect(() => {
        const cadClienteRef = ref(db, 'cad_cliente');
        onValue(cadClienteRef, (snapshot) => {
            const data = snapshot.val();
            setClientes(data || []);
        });
        const cadProdutoRef = ref(db, 'cad_produto');
        onValue(cadProdutoRef, (snapshot) => {
            const data = snapshot.val();
            setProdutos(data || []);
        });
        const locacoesRef = ref(db, 'locacoes');
        onValue(locacoesRef, (snapshot) => {
            const data = snapshot.val();
            setLocacoes(data || []);
        });
    }, []);

    // Handle form submission
    const handleSubmit = async (event) => {
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
            valor: tipoLocacao === 'Mensal' ? valorMensal : valorFicha, valorPorcentagem
        };

        const updatedLocacoes = [...locacoes, novaLocacao];
        setLocacoes(updatedLocacoes);

        // Update Firebase
        const locacoesRef = ref(db, 'locacoes');
        await set(locacoesRef, updatedLocacoes);

        setClienteSelecionado(null);
        setProdutoSelecionado(null);
        setTipoLocacao(null);
        setValorMensal(null);
        setValorFicha(null);
        setvalorPorcentagem(null);
    };

    // Handle product deregistration
    const handleDescadastrar = async (produtoId) => {
        const updatedLocacoes = locacoes.filter(locacao => locacao.produto.productId !== produtoId);
        setLocacoes(updatedLocacoes);

        // Update Firebase
        const locacoesRef = ref(db, 'locacoes');
        await set(locacoesRef, updatedLocacoes);

        const updatedProdutos = produtos.map(produto => {
            if (produto.productId === produtoId) {
                return {...produto, locado: false};
            } else {
                return produto;
            }
        });
        setProdutos(updatedProdutos);
        const produtosRef = ref(db, 'produtos');
        await set(produtosRef, updatedProdutos);
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
              {tipoLocacao === 'Porcentagem' && (
                <td style={{ border: '0px solid black', padding: '10px' }}>
                  <input
                    type="number"
                    value={valorPorcentagem}
                    onChange={e => setvalorPorcentagem(e.target.value)}
                    placeholder="Porcentagem"
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
                    <th>Porcentagem</th>
                  </tr>
                </thead>

                <tbody>
                  {locacoesCliente.map((locacao, index) => (
                    <tr key={index}>
                      <td>{locacao.produto.productId}</td>
                      <td>{locacao.tipoLocacao}</td>
                      <td>{locacao.valor}</td>
                      <td>{locacao.valorPorcentagem}</td>
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