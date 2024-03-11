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
} from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ModalCobranca from "./components/ModalCobranca";

const AreaCobranca = () => {
  // States
  const [searchTerm, setSearchTerm] = useState(""); // New state for the search term
  const {isOpen, onOpen, onClose} = useDisclosure();

  const [locacoes, setLocacoes] = useState([]);
  const [locacaoRealizarCobranca, setLocacaoCobranca] = useState(null);

  // Load data from local storage
  useEffect(() => {
    const db_locacoes = localStorage.getItem("locacoes")
      ? JSON.parse(localStorage.getItem("locacoes"))
      : [];
    setLocacoes(db_locacoes);
  }, []);

  return (
    <Flex
      h="100vh"
      align="auto"
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
                      <Th fontSize="13px">Nome</Th>
                      <Th fontSize="13px">Produto ID</Th>
                      <Th>Tipo</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {locacoes
                      .filter((locacao) =>
                        locacao.produto.productId.toLowerCase() === searchTerm.toLowerCase()
                        ||
                        locacao.cliente.name.toLowerCase() === searchTerm.toLowerCase()
                        ||
                        locacao.cliente.cpf.toLowerCase() === searchTerm.toLowerCase()
                      )
                      .map((locacao, index) => (
                        <Tr key={index} cursor="pointer" _hover={{ bg: "gray.100" }}>
                          <Td>{locacao.cliente.name}</Td>
                          <Td>{locacao.produto.productId}</Td>
                          <Td>{locacao.produto.type}</Td>
                          <Td>
                            <Button colorScheme="yellow" onClick={() => [setLocacaoCobranca(locacao), onOpen()]}>
                              Realizar Cobrança
                            </Button>
                          </Td>
                        </Tr>
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