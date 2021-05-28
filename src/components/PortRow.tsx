import React from 'react'
import {ListItem, Tag, Text, Divider, Flex, useColorModeValue} from '@chakra-ui/react'
import { PortData } from '../model/model'


interface PortRowProps {
    data: PortData
    divider?: boolean
}

export default function PortRow(props: PortRowProps) {
    const chipColor = useColorModeValue("green", "purple")
    return (
        <ListItem direction="row" w="full" px={4}>
            <Flex direction="row">
                <Flex direction="column" wrap="nowrap" basis={"50%"} justify="center" pr={1}>
                    <Text w="full" fontSize={"18px"}>{props.data.name}</Text>
                    <Text w="full" fontSize={"10px"}>{`pid: ${props.data.pid}`}</Text>
                </Flex>
                <Flex direction="row" wrap="wrap" basis={"50%"} justify="center" align="center" pl={1}>
                    {props.data.ports.map(port => 
                        <Tag key={port} m={1} variant="outline" colorScheme={chipColor}>{port}</Tag>
                    )}
                </Flex>
            </Flex>
            {props.divider && <Divider mt={4}/>}
       </ListItem>
    )
}