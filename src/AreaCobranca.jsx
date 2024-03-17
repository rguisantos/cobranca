import {
  Box,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  useDisclosure,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Collapse,
} from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ModalCobranca from "./components/ModalCobranca";

const AreaCobranca = () => {
  // States
  const [searchTerm, setSearchTerm] = useState(""); // New state for the search term
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [collapseId, setCollapseId] = useState(null); // New state for the collapse ID

  const [locacoes, setLocacoes] = useState([]);
  const [locacaoRealizarCobranca, setLocacaoCobranca] = useState(null);

  // Load data from local storage
  useEffect(() => {
    const db_locacoes = localStorage.getItem("locacoes")
      ? JSON.parse(localStorage.getItem("locacoes"))
      : [];
    setLocacoes(db_locacoes);
  }, []);

  // Filtrar locações
  const locacoesFiltradas = locacoes.filter((locacao) =>
    locacao.produto.productId.toLowerCase() === searchTerm.toLowerCase()
    ||
    locacao.cliente.name.toLowerCase() === searchTerm.toLowerCase()
    ||
    locacao.cliente.cpf.toLowerCase() === searchTerm.toLowerCase()
  );

  // Agrupar locações filtradas por cliente
  const locacoesPorCliente = locacoesFiltradas.reduce((acc, locacao) => {
    const clienteName = locacao.cliente.name;
    if (!acc[clienteName]) {
      acc[clienteName] = [];
    }
    acc[clienteName].push(locacao);
    return acc;
  }, {});

  return (
    <Flex
      h="100vh"
      align="left"
      justify="center"
      fontSize="13px"
      fontFamily="poppins"
    >
      <Box maxW={1200} w="100%" h="100vh" py={10} px={2}>

        <Tabs>
          <TabList>
            <Tab>Cobrar</Tab>
            <Tab>Historico Cobrança</Tab>
          </TabList>

          <Input // New input field for the search term
            placeholder="Buscar locação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <TabPanels>
            <TabPanel>
              <Box overflowY="auto" height="100%">
                <Table mt="2">
                  <Thead>
                    <Tr>
                      <Th>Cliente</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {Object.entries(locacoesPorCliente).map(([clienteName, locacoesCliente], index) => (
                      <React.Fragment key={index}>
                        <Tr cursor="pointer" _hover={{ bg: "gray.100" }} onClick={() => setCollapseId(collapseId === index ? null : index)}>
                          <Td>{clienteName}</Td>
                        </Tr>
                        <Collapse in={collapseId === index}>
                          {locacoesCliente.map((locacao, locacaoIndex) => (
                            <Box key={locacaoIndex} pl={5}>
                              <Thead>
                                <Tr>
                                  <Th fontSize="13px">Plaqueta</Th>
                                  <Th fontSize="13px">Tipo</Th>
                                  <Th fontSize="13px">Tipo de Locação</Th>
                                  <Th fontSize="13px">Valor</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                <Td color="blue"><big><b>{locacao.produto.productId}</b></big></Td>
                                <Td>{locacao.produto.type}</Td>
                                <Td>{locacao.tipoLocacao}</Td>
                                <Td>{locacao.valorPorcentagem}</Td>
                                <Td>R$: {locacao.tipoLocacao === 'porcentagem' ? locacao.valorPorcentagem : locacao.valor}</Td>
                                <Td>
                                  <Button colorScheme="yellow" onClick={() => [setLocacaoCobranca(locacao), onOpen()]}>
                                    Realizar Cobrança
                                  </Button>
                                </Td>
                              </Tbody>
                            </Box>
                          ))}
                        </Collapse>
                      </React.Fragment>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
            <TabPanel>
              <p>Conteúdo da Tab 2</p>
            </TabPanel>
          </TabPanels>
        </Tabs>

      </Box>
      {isOpen && (
        <ModalCobranca
          isOpen={isOpen}
          onClose={onClose}
          locacao={locacaoRealizarCobranca}
        />
      )}
    </Flex>
  );
}
export default AreaCobranca;