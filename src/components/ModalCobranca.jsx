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

const ModalCobranca = ({locacao, isOpen, onClose}) => {
    const [loc, setLocacao] = useState(locacao || null);
    const [relogioAtual, setRelogioAtual] = useState(loc.produto.counter || 0);


    return (
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cobrança</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <FormControl display="flex" flexDir="column" gap={4}>
                    <Box>
                        <FormLabel>Cliente</FormLabel>
                        <Input
                        disabled="disabled"
                            readonly="readonly"
                            type="text"
                            value={loc.cliente.name}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Produto</FormLabel>
                        <Input
                        disabled="disabled"
                            readonly="readonly"
                            type="text"
                            value={loc.produto.productId}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Relógio anterior</FormLabel>
                        <Input
                        disabled="disabled"
                        readonly="readonly"
                            type="text"
                            value={loc.produto.counter}
                            />
                        </Box>
                        <Box>
                        <FormLabel>Relógio atual</FormLabel>
                        <Input
                            type="text"
                            value={relogioAtual}
                            onChange={(e) => setRelogioAtual(e.target.value)}
                            />
                        </Box>
                        
                        <Box>
                        <FormLabel>Partidas Jogadas</FormLabel>
                        <Input
                        disabled="disabled"
                        readonly="readonly"
                            type="text"
                            value={relogioAtual - loc.produto.counter}
                            />
                        </Box>
                        
                        <Box>
                        <FormLabel>Valor Cobrança</FormLabel>
                        <Input
                        disabled="disabled"
                        readonly="readonly"
                            type="text"
                            value={loc.tipoLocacao === 'Mensal' ? loc.valor : parseFloat(loc.valor)*(relogioAtual - loc.produto.counter)}
                            />
                        </Box>
                    </FormControl>
                </ModalBody>
                <ModalFooter justifyContent="start">
                    <Button colorScheme="green" mr={3}>
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
  
export default ModalCobranca;