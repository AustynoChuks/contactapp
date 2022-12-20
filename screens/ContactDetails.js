import React, {useEffect, useState} from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";

const ContactDetails = ({route, navigation})=>{
    const {details} = route.params;
    const initials = ((details.givenName.length > 0)?details.givenName[0]:"") + ((details.familyName.length > 0)?details.familyName[0] :"");
    const [isReady, setIsReady] = useState(false);
    const [favoriteContact, setFavoriteContact] = useState(null);

    const getFavoriteContact = async ()=>{
        let favContact = await AsyncStorage.getItem("FAVORITE_CONTACT_RECORD_ID");
        await setFavoriteContact(favContact);
        setIsReady(true);
    }

    useEffect(()=>{
        getFavoriteContact()
    }, []);

    if(!isReady){
        return null
    }

    return(
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.breadCrumb}>
                        <View style={styles.thumbnail}>
                            <Text style={styles.thumbnailText}>{initials}</Text>
                        </View>
                        <Text style={styles.displayName}>{details.displayName}</Text>
                        {(details.company != "")&&<Text style={styles.label}>{details.company}</Text>}
                    </View>
                    <View>
                    {
                        details.phoneNumbers.map((phone, i)=>(
                            <TouchableOpacity style={styles.contactBtn} key={i}>
                                <View style={{minHeight:50, justifyContent:"center"}}>
                                    <Text style={styles.displayName}>{phone.number}</Text>
                                    <Text style={styles.label}>{phone.label}</Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                    </View>

                    
                </ScrollView>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity onPress={()=>{
                    let newStarID = (favoriteContact != details.recordID) ? details.recordID : null
                    setFavoriteContact(newStarID);
                    if(newStarID){
                        AsyncStorage.setItem("FAVORITE_CONTACT_RECORD_ID", newStarID);
                    }else{
                        AsyncStorage.removeItem("FAVORITE_CONTACT_RECORD_ID");
                    }
                }}>
                    {(favoriteContact == details.recordID)? <Image style={styles.image} source={require('../assets/images/star-filled.png')}/>
                    : <Image style={styles.image} source={require('../assets/images/star-blank.png')}/>}
                </TouchableOpacity>
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
    breadCrumb:{
        paddingVertical:40,
        backgroundColor:"#eadedc",
        justifyContent:"center",
        alignItems:"center"
    },
    thumbnail:{
        width:100,
        height:100,
        backgroundColor:"orange",
        borderRadius:100,
        alignItems:"center",
        justifyContent:"center"
    },
    thumbnailText: {
        color:"#fff",
        fontSize:30,
        fontWeight:"bold"
    },
    displayName:{
        fontSize:16,
        fontWeight:"lighter",
        marginTop:15,
        color:"#000",
        fontFamily:"helvetica"
    },
    contactBtn:{
        paddingHorizontal:15,
        paddingVertical:10,
        borderWidth:0.5,
        borderColor:"#f1f1f1"
    },
    label:{
        fontSize:10,
        color:"#000"
    },
    image:{
        width:40,
        height:40
    },
    footer:{
        position:"absolute",
        bottom:0,
        paddingVertical:20
    }
});
export default ContactDetails;