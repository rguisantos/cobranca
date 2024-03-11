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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ModalComp from "./components/ModalComp";

const cadastroClientes = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // New state for the search term

  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  });

  useEffect(() => {
    const db_costumer = localStorage.getItem("cad_cliente")
    ? JSON.parse(localStorage.getItem("cad_cliente"))
    : [];

    setData(db_costumer);
  }, [setData]);

  const handleRemove = (cpf) => {
    const newArray = data.filter((item) => item.cpf !== cpf);

    setData(newArray);

    localStorage.setItem("cad_cliente", JSON.stringify(newArray));
  };

  return (
      <Flex
        h="100vh"
        align="auto"
        justify="center"
        fontSize="13px"
        fontFamily="poppins"
      >
        <Box maxW={1200} w="100%" h="100vh" py={10} px={2}>
          <Button colorScheme="blue" onClick={() => [setDataEdit({}), onOpen()]}>
            Novo Cliente
          </Button>

          <Input // New input field for the search term
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Box overflowY="auto" height="100%">
            <Table mt="2">
              <Thead>
                <Tr>
                  <Th fontSize="13px">Nome</Th>
                  <Th fontSize="13px">CPF</Th>
                  <Th fontSize="13px">RG</Th>
                  <Th fontSize="13px">Telefone</Th>
                  <Th fontSize="13px">Endereço</Th>
                  <Th fontSize="13px">Bairro</Th>
                  <Th fontSize="13px">Cidade</Th>
                  <Th fontSize="13px">Estado (UF)</Th>
                  <Th p={0}></Th>
                  <Th p={0}></Th>
                </Tr>
              </Thead>
              <Tbody>
                {data
                  .filter((client) =>
                    client.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(({ name, cpf, rg, phone, address, neighborhood, city, state }, index) => (
                  <Tr key={index} cursor="pointer" _hover={{ bg: "gray.100" }}>
                    <Td>{name}</Td>
                    <Td>{cpf}</Td>
                    <Td>{rg}</Td>
                    <Td>{phone}</Td>
                    <Td>{address}</Td>
                    <Td>{neighborhood}</Td>
                    <Td>{city}</Td>
                    <Td>{state}</Td>
                    <Td p={1}>
                      <Button colorScheme="yellow" onClick={() => [setDataEdit({ name, cpf, rg, phone, address, neighborhood, city, state, index }), onOpen()]}>
                        Editar
                      </Button>
                    </Td>
                    <Td p={1}>
                      <Button colorScheme="red" onClick={() => handleRemove(cpf)}>Excluir</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
              </Table>
            </Box>
        </Box>
        {isOpen && (
          <ModalComp
            isOpen={isOpen}
            onClose={onClose}
            data={data}
            setData={setData}
            dataEdit={dataEdit}
            setDataEdit={setDataEdit}
          />
        )}
      </Flex>
  );
}

export default cadastroClientes;