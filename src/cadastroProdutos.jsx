import { Flex, Box, Button, Table, Thead, Tr, Th, Td, Tbody, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Input } from "@chakra-ui/react";
import React, { useState, useEffect, useRef } from 'react';
import ProductModal from './ProductModal';

function cadastroProdutos() {
  const [products, setProducts] = useState([]);
  const [productEdit, setProductEdit] = useState({});
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [deleteProductIndex, setDeleteProductIndex] = useState(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const cancelRef = useRef();

  useEffect(() => {
    const storedProducts = localStorage.getItem('cad_produto');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const handleEditProduct = (product, index) => {
    setProductEdit({ ...product, index });
    setProductModalOpen(true);
  };

  const handleAddProduct = () => {
    setProductEdit({});
    setProductModalOpen(true);
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter((_, index) => index !== deleteProductIndex));
    setDeleteProductIndex(null);
    setDeleteDialogOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Flex
      h="100vh"
      align="auto"
      justify="center"
      fontSize="13px"
      fontFamily="poppins"
    >
      <Box maxW={1200} w="100%" h="100vh" py={10} px={2}>
        <Button colorScheme="blue" onClick={handleAddProduct}>
          Adicionar Produto
        </Button>
        <Input
          placeholder="Buscar produto"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Box overflowY="auto" height="100%">
          <Table mt="2">
            <Thead>
              <Tr>
                <Th>Produto ID</Th>
                <Th>Tipo</Th>
                <Th>Detalhe</Th>
                <Th>Tamanho</Th>
                <Th>Contador</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredProducts.map((product, index) => (
                <Tr key={index}>
                  <Td>{product.productId}</Td>
                  <Td>{product.type}</Td>
                  <Td>{product.detail}</Td>
                  <Td>{product.size}</Td>
                  <Td>{product.counter}</Td>
                  <Td>
                  <Button onClick={() => handleEditProduct(product, index)}>Editar</Button>
                  <Button colorScheme="red" onClick={() => { setDeleteProductIndex(index); setDeleteDialogOpen(true); }}>Excluir</Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <ProductModal
          data={products}
          setData={setProducts}
          dataEdit={productEdit}
          isOpen={isProductModalOpen}
          onClose={() => setProductModalOpen(false)}
        />
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Excluir Produto
              </AlertDialogHeader>

              <AlertDialogBody>
                Você realmente deseja excluir este produto?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onClick={handleDeleteProduct} ml={3}>
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </Flex>
  );
}

export default cadastroProdutos;