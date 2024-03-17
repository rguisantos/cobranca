import { Tabs, TabList, TabPanels, Tab, TabPanel, Button, VStack, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure } from "@chakra-ui/react";
import CadastroClientes from './cadastroClientes';
import CadastroProdutos from './cadastroProdutos';
import CadastroLocacoes from "./cadastroLocacoes";
import AreaCobranca from "./AreaCobranca";
import firebase from './firebase';

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tabs variant="unstyled" isLazy>
      <Button onClick={onOpen}>Menu</Button>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <TabList flexDirection="column">
              <Tab _selected={{ color: "white", bg: "blue.500" }} _hover={{ color: "blue.500" }}>Cadastrar Clientes</Tab>
              <Tab _selected={{ color: "white", bg: "blue.500" }} _hover={{ color: "blue.500" }}>Cadastrar Produtos</Tab>
              <Tab _selected={{ color: "white", bg: "blue.500" }} _hover={{ color: "blue.500" }}>Cadastrar Locações</Tab>
              <Tab _selected={{ color: "white", bg: "blue.500" }} _hover={{ color: "blue.500" }}>Area Cobrança</Tab>
            </TabList>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      <TabPanels flex="1">
        <TabPanel>
          <CadastroClientes />
        </TabPanel>
        <TabPanel>
          <CadastroProdutos />
        </TabPanel>
        <TabPanel>
          <CadastroLocacoes />
        </TabPanel>
        <TabPanel>
          <AreaCobranca />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default App;