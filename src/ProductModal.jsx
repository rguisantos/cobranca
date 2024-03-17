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
import { useEffect, useState } from "react";
import firebase from './firebase';

const ProductModal = ({data, setData, dataEdit, isOpen, onClose}) => {
    const [productId, setProductId] = useState("");
    const [type, setType] = useState("");
    const [detail, setDetail] = useState("");
    const [size, setSize] = useState("");
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        setProductId(dataEdit.productId || "");
        setType(dataEdit.type || "");
        setDetail(dataEdit.detail || "");
        setSize(dataEdit.size || "");
        setCounter(dataEdit.counter || 0);
    }, [dataEdit]);

    const handleSave = async () => {
        if (!productId || !type || !detail || !size) return;

        if (productIdAlreadyExists()) {
            return alert("Número do produto já cadastrado");
        }
        if (Object.keys(dataEdit).length) {
            data[dataEdit.index] = { productId, type, detail, size, counter };
        }
        const newDataArray = !Object.keys(dataEdit).length
        ? [...(data ? data : []), { productId, type, detail, size, counter }]
        : [...(data ? data : [])];

        // Save data to Firebase
        const db = firebase.database();
        await db.ref('cad_produto').set(newDataArray);

        setData(newDataArray);
        onClose();
    };

    const productIdAlreadyExists = () => {
        if (dataEdit.productId !== productId && data?.length) {
            return data.find((item) => item.productId === productId);
        }

        return false;
    };

    return (
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cadastro de Produtos</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <FormControl display="flex" flexDir="column" gap={4}>
                    <Box>
                        <FormLabel>Número do Produto</FormLabel>
                        <Input
                            type="text"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Tipo</FormLabel>
                        <Input
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Detalhe (Cor)</FormLabel>
                        <Input
                            type="text"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Tamanho</FormLabel>
                        <Input
                            type="text"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Relógio (Contador)</FormLabel>
                        <Input
                            type="number"
                            value={counter}
                            onChange={(e) => setCounter(e.target.value)}
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
  
export default ProductModal;