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
    Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import { db } from './firebase';
import { ref, set } from 'firebase/database';

const ModalCobranca = ({ locacao, isOpen, onClose }) => {
    const [loc, setLocacao] = useState(locacao || null);
    const [relogioAtual, setRelogioAtual] = useState("");
    const [desconto, setDesconto] = useState(0); // novo estado para o desconto
    const [showDescontoInput, setShowDescontoInput] = useState(false); // novo estado para controlar a visibilidade do campo de desconto
    const [valorRecebido, setValorRecebido] = useState(0);
    const [saldoDevedor, setSaldoDevedor] = useState(0);

    const handleSubmit = async () => {
        // Atualize o banco de dados com o novo valor recebido, saldo devedor, relogioAtual e loc.product.counter
        try {
            // Save data to Firebase
            const cobrancaRef = ref(db, `cobranca/${loc.id}`);
            await set(cobrancaRef, {
                valorRecebido,
                saldoDevedor,
                relogio: relogioAtual,
                counter: relogioAtual, // atualiza o counter com o valor de relogioAtual
            });

            // Atualize o estado local com os novos valores
            setLocacao({
                ...loc,
                valorRecebido,
                saldoDevedor,
                relogio: relogioAtual,
                product: {
                    ...loc.product,
                    counter: relogioAtual, // atualiza o counter no estado local
                },
            });
            // Feche o modal
            onClose();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Cobrança</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl display="flex" flexDir="column" gap={1}>
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
                                type="number"
                                value={relogioAtual}
                                onChange={(e) => {
                                    setRelogioAtual(e.target.value);
                                }}
                            />
                        </Box>

                        <Checkbox value="showDesconto" onChange={(e) => setShowDescontoInput(e.target.checked)}>
                            Mostrar campo de desconto
                        </Checkbox>

                        {showDescontoInput && (
                            <Box>
                                <FormLabel>Desconto</FormLabel>
                                <Input
                                    type="number"
                                    value={desconto}
                                    onChange={(e) => {
                                        setDesconto(e.target.value);
                                    }}
                                />
                            </Box>
                        )}
                        {relogioAtual - loc.produto.counter >= 0 && (
                            <Box>
                                <FormLabel>Partidas Jogadas</FormLabel>
                                <Input
                                    disabled="disabled"
                                    readonly="readonly"
                                    type="text"
                                    value={relogioAtual - loc.produto.counter - desconto} // subtrai o desconto do número de partidas jogadas
                                />
                            </Box>
                        )}

                        {
                            (loc.tipoLocacao === 'Mensal' ? loc.valor : parseFloat(loc.valor) * (relogioAtual - loc.produto.counter - desconto)) > 0 && (
                                <>
                                    <Box>
                                        <FormLabel>Valor Bruto</FormLabel>
                                        <Input
                                            disabled="disabled"
                                            readonly="readonly"
                                            type="text"
                                            value={loc.tipoLocacao === 'Mensal' ? loc.valor : parseFloat(loc.valor) * (relogioAtual - loc.produto.counter - desconto)}
                                        />
                                    </Box>
                                    <Box>
                                        <FormLabel>Valor a Pagar</FormLabel>
                                        <Input
                                            disabled="disabled"
                                            readonly="readonly"
                                            type="text"
                                            value={loc.tipoLocacao === 'Mensal' ? loc.valor : (parseFloat(loc.valor) * (relogioAtual - loc.produto.counter - desconto)) * (locacao.valorPorcentagem / 100)}
                                        />
                                    </Box>
                                    <Box>
                                        <FormLabel>Valor Recebido</FormLabel>
                                        <Input
                                            type="number"
                                            value={valorRecebido}
                                            onChange={(e) => {
                                                const valor = e.target.value;
                                                setValorRecebido(valor);
                                                setSaldoDevedor(valor - (loc.tipoLocacao === 'Mensal' ? loc.valor : (parseFloat(loc.valor) * (relogioAtual - loc.produto.counter - desconto)) * (locacao.valorPorcentagem / 100)));
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <FormLabel>Saldo Devedor</FormLabel>
                                        <Input
                                            disabled="disabled"
                                            readonly="readonly"
                                            type="text"
                                            value={(loc.tipoLocacao === 'Mensal' ? loc.valor : (parseFloat(loc.valor) * (relogioAtual - loc.produto.counter - desconto)) * (locacao.valorPorcentagem / 100) - valorRecebido)}
                                        />
                                    </Box>
                                </>
                            )
                        }
                    </FormControl>
                </ModalBody>
                <ModalFooter justifyContent="start">
                    <Button colorScheme="green" mr={3} onClick={handleSubmit}>
                        SALVAR
                    </Button>
                    <Button colorScheme="red" onClick={onClose}>
                        CANCELAR
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
export default ModalCobranca;