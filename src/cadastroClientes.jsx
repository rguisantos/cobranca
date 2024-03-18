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
  TableContainer,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ModalComp from "./ModalComp";
import { ref, onValue, set, getDatabase } from 'firebase/database';

const CadastroClientes = () => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [data, setData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const isMobile = useBreakpointValue({
    base: true,
    lg: false,
  });

  useEffect(() => {
    const cadClienteRef = ref(getDatabase(), 'cad_cliente');
    onValue(cadClienteRef, (snapshot) => {
      const data = snapshot.val();
      // Convert object to array
      const dataArray = data ? Object.keys(data).map(key => ({...data[key], id: key})) : [];
      setData(dataArray);
    });
  }, []);

  const handleRemove = async (cpf) => {
    if (Array.isArray(data)) {
      const newArray = data.filter((item) => item.cpf !== cpf);
      setData(newArray);
      const cadClienteRef = ref(getDatabase(), 'cad_cliente');
      await set(cadClienteRef, newArray);
    }
  };

  return (
      <Flex
        maxWidth={isMobile ? "80%" : "100%"}
        align="left"
        justify="left"
        fontSize="13px"
        fontFamily="poppins"
      >
        <Box bg="gray.100" p={1} rounded="md">
          <TableContainer>
          <Button m="1" colorScheme="green" onClick={() => {setDataEdit({}); onOpen();}}>
            Novo Cliente
          </Button>
          <Input h="12" m="1" bg="gray.50" w="85%"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          </TableContainer>
            <Table bg="white" w="auto" p={1} rounded="md" mt="2">
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
              <Tbody bg="gray.50" p={2} rounded="md">
              {data
  .filter((client) =>
    client.name ? client.name.toLowerCase().includes(searchTerm.toLowerCase()) : false
  )
  .map(({ name, cpf, rg, phone, address, neighborhood, city, state }, index) => (
  // ...
<Tr key={index} cursor="pointer" _hover={{ bg: "blue.100" }}>
                    <Td>{name}</Td>
                    <Td>{cpf}</Td>
                    <Td>{rg}</Td>
                    <Td>{phone}</Td>
                    <Td>{address}</Td>
                    <Td>{neighborhood}</Td>
                    <Td>{city}</Td>
                    <Td>{state}</Td>
                    <Td p={1}>
                      <Button colorScheme="yellow" onClick={() => {setDataEdit({ name, cpf, rg, phone, address, neighborhood, city, state, index }); onOpen();}}>
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

export default CadastroClientes;