import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    Image,
    FlatList,
    Platform,
    PermissionsAndroid,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Contacts from 'react-native-contacts';

const ContactList = ({navigation, ...props})=>{
    const [listOfContacts, setListOfContacts] = useState([]);
    const [favoriteContactRecordID, setFavoriteContactRecordID] = useState(null);

    const fetchContacts = ()=>{
        try{
            Contacts.getAll().then(async (data)=>{
                await setListOfContacts(data.sort((a, b)=>a.displayName.localeCompare(b.displayName)));
                getFavoriteContact()
            }).catch(err=>{
                //console.log(err)
            })
        }catch(err){
            //console.log(err)
        }
    }

    const getFavoriteContact = ()=>{
        AsyncStorage.getItem("FAVORITE_CONTACT_RECORD_ID", (err, recordID)=>{
            if(err)return false;
            setFavoriteContactRecordID(recordID);
            if(recordID == null){
                setListOfContacts(listOfContacts.sort((a, b)=>a.displayName.localeCompare(b.displayName)));
                return null;
            }
            let fav = listOfContacts.find(c=>c.recordID == recordID);
            if(fav){
                setListOfContacts([
                    fav, ...listOfContacts.filter(c=>c.recordID != recordID)
                    .sort((a, b)=>a.displayName.localeCompare(b.displayName))
                ]);
            }
        })
    }

    useEffect(()=>{
        navigation.addListener("focus", ()=>{
            if(navigation.isFocused()){
                getFavoriteContact();
            }
        })

        if(Platform.OS === 'android'){
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Contacts',
                    'message': 'This app would like to view your contacts.',
                    'buttonPositive': 'Accept'
                }).then(fetchContacts)
                .catch(err=>{
                    //console.log("No access has been granted")
                })
        }else{
            fetchContacts()
        }
    }, [navigation]);

    return(
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <FlatList
                    data={listOfContacts}
                    renderItem={({item})=>{
                        if(item.recordID == favoriteContactRecordID){
                            return (
                                <TouchableOpacity style={styles.contactBtn} onPress={()=>{
                                    navigation.navigate("contactdetails", {details:item});
                                }}>
                                    <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                                        <View style={{minHeight:50, justifyContent:"center"}}>
                                            <Text style={styles.displayName}>{item.displayName}</Text>
                                            {(item.company != "")&&<Text style={styles.label}>{item.company}</Text>}
                                        </View>
                                        <View>
                                            <Image style={styles.image} source={require('../assets/images/star-filled.png')}/>
                                        </View>
                                    </View>
                                </TouchableOpacity>)
                        }
                        return (<TouchableOpacity style={styles.contactBtn} onPress={()=>{
                            navigation.navigate("contactdetails", {details:item});
                        }}>
                            <View style={{minHeight:50, justifyContent:"center"}}>
                                <Text style={styles.displayName}>{item.displayName}</Text>
                                {(item.company != "")&&<Text style={styles.label}>{item.company}</Text>}
                            </View>
                        </TouchableOpacity>)
                    }}
                    keyExtractor={item => item.recordID}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper:{
        width:"100%",
        justifyContent:"center",
        flex:1,
        flexDirection:"row"
    },
    container:{
        width:"100%",
        maxWidth:500,
        backgroundColor:"#fff",
    },
    heading:{
        color:"#333",
        fontSize:30,
        padding:15
    },
    contactBtn:{
        paddingHorizontal:15,
        paddingVertical:10,
        borderWidth:0.5,
        borderColor:"#f1f1f1"
    },
    displayName:{
        fontSize:16,
        //fontWeight:"bold"
    },
    image:{
        width:40,
        height:40
    },
    label:{
        fontSize:10,
        color:"#000"
    }
});
export default ContactList