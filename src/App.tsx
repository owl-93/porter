import React, { useEffect, useState } from 'react';
import { IpcApi, PortData } from './model/model';
import { useColorModeValue, ListItem, List, Flex, useToast, UseToastOptions, Spinner, Center, ScaleFade} from '@chakra-ui/react'
import AppBar from './components/AppBar';
import PortRow from './components/PortRow';
import PortListHeader from './components/PortListHeader';
import { usePortListener } from './hooks/usePortListener';
import { portDataShallowCompare } from './utils/portUtils';

const headerHeight = 64



interface PorterWindow extends Window {
  ipcApi?: IpcApi
}

const ipcApi = (window as PorterWindow).ipcApi
//console.log("renderer:", porterWindow.ipcRenderer)

function App() {
  //const {result} = usePortData(ipcApi, 10000)
  const accentColor = useColorModeValue("green.500", "green.300")
  const bg = useColorModeValue("white", "gray.800")
  const [currentData, setCurrentData] = useState<PortData[] | undefined>()
  const {data, error} = usePortListener(ipcApi, true)
  const toast = useToast()

  useEffect(() => {
    if(data) {
      if(!portDataShallowCompare(data, currentData)) {
        toast(successToast)
        setCurrentData(data)
      }
    }else if(error) {
      toast(failToast)
    }
  }, [data, error, currentData, setCurrentData, toast]) 

  return (
    <Flex bg={bg} overflowY="hidden" w="full" h="full" direction="column">
      <AppBar height={headerHeight}/>
      <PortListHeader/>
      
      {currentData === undefined ? 
        <Center w="full" h="full">
          <ScaleFade in={currentData === undefined}> <Spinner color={accentColor} size="xl"/></ScaleFade>
        </Center>
        :
          <List w="full" spacing={4} grow={1} overflowY="auto" py={4}>
            <ScaleFade in={currentData !== undefined} >
              {!currentData ? <ListItem>No Data</ListItem> : 
                <>
                  {currentData.map((d: PortData, idx: number) => 
                    <PortRow key={d.pid} data={d} divider={idx !== currentData.length-1} /> 
                  )}
                </>
              }
            </ScaleFade>
          </List>
      }
      
    </Flex>
  );
}

const successToast: UseToastOptions = {
  title: "Updated Port Data",
  status: "success",
  duration: 3000,
  isClosable: true
}

const failToast: UseToastOptions = {
  title: "Porter Service Error",
  status: "error",
  duration: 3000,
  isClosable: true
}

export default App;
