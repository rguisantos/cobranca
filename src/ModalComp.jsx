import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Box,
} from "@chakra-ui/react";
import { useState } from "react";
import { db } from './firebase';
import { ref, set } from 'firebase/database';

const ModalComp = ({data, setData, dataEdit = {}, isOpen, onClose}) => {
    const [name, setName] = useState(dataEdit.name ||"");
    const [cpf, setCpf] = useState(dataEdit.cpf ||"");
    const [rg, setRg] = useState(dataEdit.rg ||"");
    const [phone, setPhone] = useState(dataEdit.phone ||"");
    const [address, setAddress] = useState(dataEdit.address ||"");
    const [neighborhood, setNeighborhood] = useState(dataEdit.neighborhood ||"");
    const [city, setCity] = useState(dataEdit.city ||"");
    const [state, setState] = useState(dataEdit.state ||"");

    const handleSave = async () => {
        if (!name || !cpf || !rg || !phone || !address || !neighborhood || !city || !state) return;

        if (cpfAlreadyExists()) {
            return alert("CPF já cadastrado");
        }
        if (Object.keys(dataEdit).length) {
            data[dataEdit.index] = { name, cpf, rg, phone, address, neighborhood, city, state };
        }
        const newDataArray = !Object.keys(dataEdit).length
        ? [...(data ? data : []), { name, cpf, rg, phone, address, neighborhood, city, state }]
        : [...(data ? data : [])];

        // Save data to Firebase
        const cadClienteRef = ref(db, 'cad_cliente');
        await set(cadClienteRef, newDataArray);

        setData(newDataArray);
        onClose();
    };

    const cpfAlreadyExists = () => {
        if (dataEdit.cpf !== cpf && data?.length) {
            return data.find((item) => item.cpf === cpf);
        }

        return false;
    };

    return (
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cadastro de Clientes</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <FormControl display="flex" flexDir="column" gap={4}>
                    <Box>
                        <FormLabel>Nome</FormLabel>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>CPF</FormLabel>
                        <Input
                            type="text"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>RG</FormLabel>
                        <Input
                            type="text"
                            value={rg}
                            onChange={(e) => setRg(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Telefone</FormLabel>
                        <Input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Endereço</FormLabel>
                        <Input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Bairro</FormLabel>
                        <Input
                            type="text"
                            value={neighborhood}
                            onChange={(e) => setNeighborhood(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Cidade</FormLabel>
                        <Input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Estado (UF)</FormLabel>
                        <Input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            />
                        </Box>
                    </FormControl>
                </ModalBody>
                <ModalFooter justifyContent="start">
                    <Button colorScheme="green" mr={3} onClick={handleSave}>
                        SALVAR
                    </Button>
                    <Button colorScheme="red" onClick={onClose}>
                        CANCELAR
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    );
}
  
export default ModalComp;