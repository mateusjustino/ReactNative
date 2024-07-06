import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import Header from "../components/Header";
import colors from "../theme/colors";
import TextInputCustom from "../components/TextInputCustom";
import { UserContext } from "../context/userContext";
import { Feather } from "@expo/vector-icons";
import { iconSize } from "../theme/icon";
import { useNavigation } from "@react-navigation/native";

const AccountSettings = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [name, setname] = useState("");
  const [showEditName, setShowEditName] = useState(false);
  return (
    <>
      <Header fromSettings />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {/* <TextInputCustom text={text} setText={setText} placeholder="teste" /> */}

        <Text>Account Settings</Text>

        <View>
          <TouchableOpacity
            style={styles.containerInfo}
            onPress={() => setShowEditName(!showEditName)}
          >
            <Text>Nome: {user.displayName}</Text>
            <TouchableOpacity>
              <Feather
                name="edit"
                size={iconSize.regular}
                color={colors.primaryBlue}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {showEditName && (
            <View>
              <Text>aaa</Text>
            </View>
          )}
        </View>
        <Text>verificação de email</Text>
        <Text>atualizar o nome</Text>
        <Text>atualizar o email</Text>
        <Text>atualizar a senha</Text>
        <Text>
          enviar email para atualizar senha (isso posso colocar no login, em
          esqueceu a senha)
        </Text>
      </ScrollView>
    </>
  );
  // return (
  //   <>
  //     <Header fromSettings />
  //     <ScrollView
  //       style={styles.container}
  //       contentContainerStyle={{ alignItems: "center" }}
  //     >
  //       <TextInputCustom text={text} setText={setText} placeholder="teste" />

  //       <TouchableOpacity
  //         style={styles.containerInfo}
  //         onPress={() => navigation.navigate("AccountSettingsUpdateName")}
  //       >
  //         <Text>Nome: {user.displayName}</Text>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate("AccountSettingsUpdateName")}
  //         >
  //           <Feather
  //             name="edit"
  //             size={iconSize.regular}
  //             color={colors.primaryBlue}
  //           />
  //         </TouchableOpacity>
  //       </TouchableOpacity>
  //       <Text>verificação de email</Text>
  //       <Text>atualizar o nome</Text>
  //       <Text>atualizar o email</Text>
  //       <Text>atualizar a senha</Text>
  //       <Text>
  //         enviar email para atualizar senha (isso posso colocar no login, em
  //         esqueceu a senha)
  //       </Text>
  //     </ScrollView>
  //   </>
  // );
};

export default AccountSettings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    padding: 10,
  },
  containerInfo: {
    flexDirection: "row",
    width: "100%",
    // backgroundColor: "red",
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
});
