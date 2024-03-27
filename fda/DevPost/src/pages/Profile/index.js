import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import {
  Container,
  Name,
  Email,
  Button,
  ButtonText,
  UploadButton,
  UploadText,
  Avatar,
  ModalContainer,
  ButtonBack,
  Input,
} from "./styles";
import { Modal, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { db, storage } from "../../firebaseConnection";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
// import { launchImageLibrary } from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";
import {
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  ref,
} from "firebase/storage";

const Profile = () => {
  const { signOut, user, setUser, storageUser } = useContext(AuthContext);
  const [nome, setNome] = useState(user?.nome);
  // const [url, setUrl] = useState("https://sujeitoprogramador.com/steve.png");
  const [url, setUrl] = useState(null);
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
  }

  async function updateProfile() {
    if (nome === "") {
      return;
    }

    await updateDoc(doc(db, "users", user?.uid), {
      nome: nome,
    });

    const q = query(collection(db, "posts"), where("userId", "==", user?.uid));
    const postDocs = await getDocs(q);
    postDocs.forEach(async (item) => {
      await updateDoc(doc(db, "posts", item.id), {
        autor: nome,
      });
    });

    let data = {
      uid: user.uid,
      nome: nome,
      email: user.email,
    };
    setUser(data);
    storageUser(data);
    setOpen(false);
  }

  const uploadFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) {
      return;
    }
    if (!result.canceled) {
      // // Convert URI to a Blob via XHTML request, and actually upload it to the network
      // const blob = await new Promise((resolve, reject) => {
      //   const xhr = new XMLHttpRequest();
      //   xhr.onload = function () {
      //     resolve(xhr.response);
      //   };
      //   xhr.onerror = function () {
      //     reject(new TypeError("Network request failed"));
      //   };
      //   xhr.responseType = "blob";
      //   xhr.open("GET", result.assets[0].uri, true);
      //   xhr.send(null);
      // });
      // const storageRef = ref(storage, "teste.jpeg");
      // const thisUsersNewPostRef = ref(storageRef, "users/img1");
      // uploadBytes(thisUsersNewPostRef, blob).then((snapshot) => {
      //   // causes crash
      //   console.log("Uploaded a blob or file!");
      // });
      const docRef = ref(storage, "image.jpeg");
      const img = await fetch(result.assets[0].uri);
      const bytes = await img.blob();

      await uploadBytes(docRef, bytes);
    }

    // console.log(result);
    // console.log(result.assets[0].fileName);
    const fileSource = result.assets[0].uri;
    // console.log(fileSource);

    // // Create the file metadata
    // /** @type {any} */
    // const metadata = {
    //   contentType: "image/jpeg",
    // };

    // // Upload file and metadata to the object 'images/mountains.jpg'
    // const storageRef = ref(storage, "teste.jpeg");
    // await uploadBytesResumable(storageRef, fileSource, metadata)
    //   .then(() => console.log("foi"))
    //   .catch((error) => console.log(error.message));

    // ------
    // const storageRef = ref(storage, "users");

    // // 'file' comes from the Blob or File API
    // uploadBytes(storageRef, fileSource).then((snapshot) => {
    //   console.log("Uploaded a blob or file!");
    // });
    //---------
    // import { getStorage, ref, uploadBytes } from "firebase/storage";

    // const storage = getStorage();
    // const storageRef = ref(storage, "some-child");

    // // 'file' comes from the Blob or File API
    // uploadBytes(storageRef, file).then((snapshot) => {
    //   console.log("Uploaded a blob or file!");
    // });

    //------------------
    // // Create the file metadata
    // /** @type {any} */
    // const metadata = {
    //   contentType: "image/jpeg",
    // };

    // // Upload file and metadata to the object 'images/mountains.jpg'
    // const storageRef = ref(storage, "users/" + user?.uid);
    // uploadBytesResumable(storageRef, fileSource, metadata)
    //   .then(() => alert("tudo certo"))
    //   .catch((error) => alert(error.message));
  };

  return (
    <Container>
      <Header />

      {url ? (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText>+</UploadText>
          <Avatar source={{ uri: url }} />
        </UploadButton>
      ) : (
        <UploadButton onPress={() => uploadFile()}>
          <UploadText>+</UploadText>
        </UploadButton>
      )}

      <Name>{user?.nome}</Name>
      <Email>{user?.email}</Email>

      <Button bg="#428cfd" onPress={() => setOpen(true)}>
        <ButtonText color="#fff">Atualizar Perfil</ButtonText>
      </Button>

      <Button bg="#ddd" onPress={handleSignOut}>
        <ButtonText color="#353840">Sair</ButtonText>
      </Button>

      <Modal visible={open} animationType="slide" transparent={true}>
        <ModalContainer behavior={Platform.OS === "android" ? "" : "padding"}>
          <ButtonBack onPress={() => setOpen(false)}>
            <Feather name="arrow-left" size={22} color="#121212" />
            <ButtonText color="#121212">Voltar</ButtonText>
          </ButtonBack>
          <Input
            placeholder={user?.nome}
            value={nome}
            onChangeText={(text) => setNome(text)}
          />

          <Button bg="#428cfd" onPress={updateProfile}>
            <ButtonText color="#fff">Salvar</ButtonText>
          </Button>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default Profile;
