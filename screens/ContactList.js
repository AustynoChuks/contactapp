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
                await setListOfContacts(data);
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
        })
    }

    useEffect(()=>{
        const unsubscribe = navigation.addListener("focus", ()=>{
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

        return unsubscribe;
    }, [1]);

    return(
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <FlatList
                    data={listOfContacts.sort((a, b)=>{
                        if(a.recordID == favoriteContactRecordID)return -1;
                        if(b.recordID == favoriteContactRecordID)return 1;
                        return a.displayName.localeCompare(b.displayName)
                    })}
                    renderItem={({item})=>{
                        const initials = ((item.givenName.length > 0)?item.givenName[0]:"") + ((item.familyName.length > 0)?item.familyName[0] :"");
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
                            <View style={{flex:1, flexDirection:"row"}}>
                                <View style={styles.thumbnail}>
                                    {
                                        (item.hasThumbnail)?
                                        <Image source={{uri:item.thumbnailPath}} style={styles.image}/>:
                                        <Text style={styles.thumbnailText}>{initials}</Text>
                                    }
                                </View>
                                <View style={{minHeight:50, justifyContent:"center", paddingHorizontal:20}}>
                                    <Text style={styles.displayName}>{item.displayName}</Text>
                                    {(item.company != "")&&<Text style={styles.label}>{item.company}</Text>}
                                </View>
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
        borderWidth:5,
        borderColor:"#fcfcfc"
    },
    displayName:{
        fontSize:16,
        color:"#000",
        fontWeight:"lighter",
        fontFamily:"helvetica"
    },
    image:{
        width:40,
        height:40
    },
    label:{
        fontSize:10,
        color:"#000"
    },
    thumbnail:{
        width:50,
        height:50,
        backgroundColor:"orange",
        borderRadius:100,
        alignItems:"center",
        justifyContent:"center"
    },
    image:{
        width:40,
        height:40
    },
    thumbnailText: {
        color:"#fff",
        fontSize:20,
        fontWeight:"bold"
    },
});
export default ContactList