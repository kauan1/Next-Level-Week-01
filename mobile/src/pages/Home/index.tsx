import React, {useState, useEffect, ChangeEvent} from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import {View, ImageBackground, Image, StyleSheet, Text,} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from  'axios';
const logo = require('../../assets/logo.png');
const background = require('../../assets/home-background.png');

interface IBGEUFRes{
  id:number;
  sigla: string;
}
interface IBGECityRes{
  id: number;
  nome: string;
}

const Home= ()=>{
    const navaigation = useNavigation();
    const [ufs, setUfs] = useState<IBGEUFRes[]>([]);
    const [cities, setCities] = useState<IBGECityRes[]>([]);
    const [selectedUF, setSelectedUF] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    function handleNavigationToPoints(){
        navaigation.navigate('Points', {
          selectedUF, selectedCity
        });
    }
    useEffect(()=>{// pega as uf's do brasil pela api do ibge
        axios.get<IBGEUFRes[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(res =>{
            setUfs(res.data);
        });
    },[]);

    useEffect(()=>{// pega as cidades de acordo com a uf selecionada
      if(selectedUF === '0'){
          return;
      }

      axios
          .get<IBGECityRes[]>(
              `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios?orderBy=nome`)
          .then(res =>{
             setCities(res.data);
          });
    },[selectedUF]);


    return (
        <ImageBackground 
            source={background} 
            style={styles.container}
            imageStyle={{width: 274, height:368}}
        >
            <View style={styles.main}>
                <Image source={logo}/>
                <Text style={styles.title}>Seu marketplace de coleta de resísuos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>

            <RNPickerSelect
              onValueChange={(value)=>setSelectedUF(value)}
              value={selectedUF}
              placeholder={{
                label:'Selecione o Estado',
                value: null
              }}
              items={
               ufs.map(item=>(
                 {
                   key: item.id,
                   label: item.sigla,
                   value: item.sigla
                 }
               ))
              }
              
            />

            <RNPickerSelect
              onValueChange={(value)=>setSelectedCity(value)}
              value= {selectedCity}
              placeholder={{
                label:'Selecione a cidade',
                value: null
              }}
              items={
                cities.map(citie =>(
                  {
                    key: citie.id,
                    label: citie.nome,
                    value: citie.nome,
                  }
                ))
              }
            />

            <View style={styles.footer}>
                <RectButton
                    style={styles.button} onPress={handleNavigationToPoints}
                >
                    <View style={styles.buttonIcon}>
                        <Text>
                            <Icon name="arrow-right" color="#FFF" size={24} /> 
                        </Text>
                    </View>
                    <Text style={styles.buttonText}>Entrar</Text>
                </RectButton>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
      
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;