import React from 'react';
import { usePortData } from './hooks/usePortData';
import { PortData } from './model/model';
import { useColorModeValue, ListItem, List, Flex } from '@chakra-ui/react'
import AppBar from './components/AppBar';
import PortRow from './components/PortRow';
import PortListHeader from './components/PortListHeader';

const headerHeight = 64

export interface IpcApi {
  send: (destination: string) => void,
  receive: (channel: string, callback: (response: {data: PortData[], error: any}) => void) => void
}

interface PorterWindow extends Window {
  ipcApi?: IpcApi
}

const ipcApi = (window as PorterWindow).ipcApi
//console.log("renderer:", porterWindow.ipcRenderer)

function App() {
  const {result} = usePortData(ipcApi, 10000)
  const bg = useColorModeValue("white", "gray.800")

  // useEffect(() => {
    
  //     ipcApi?.receive('ports-reply', (data: PortData[]) => {
  //       console.log(`received ports:`, data)
  //       setData(data)
  //     })

  //     const getPorts = () => ipcApi?.send('ports')

  //     getPorts()
  //     interval = setInterval(getPorts, 3000)
    
  //   return () => clearInterval(interval)
  
  // }, [])


  return (
    <Flex bg={bg} overflowY="hidden" w="full" h="full" direction="column">
      <AppBar height={headerHeight}/>
      <PortListHeader/>
      <List w="full" spacing={4} grow={1} overflowY="auto" py={4}>
        {!result ? <ListItem>No Data</ListItem> : 
          <>
            {result.map((d: PortData, idx: number) => 
              <PortRow key={d.pid} data={d} divider={idx !== result.length-1} /> 
            )}
          </>
        }
        </List>
    
    </Flex>
  );
}

export default App;
