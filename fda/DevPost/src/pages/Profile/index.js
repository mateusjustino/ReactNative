import React, { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    let isActive = true;
    async function loadAvatar() {
      try {
        if (isActive) {
          const storageRef = ref(storage, "users/" + user?.uid);
          getDownloadURL(storageRef).then((linkUrl) => {
            setUrl(linkUrl);
          });
        }
      } catch (error) {
        console.log("foto nao encontrada");
      }
    }
    loadAvatar();

    return () => (isActive = false);
  }, []);

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
      const fileSource = result.assets[0].uri;
      const docRef = ref(storage, "users/" + user?.uid);
      const img = await fetch(fileSource);
      const bytes = await img.blob();

      await uploadBytes(docRef, bytes).then(() => {
        uploadAvatarPost();
      });
      setUrl(fileSource);
    }
  };

  const uploadAvatarPost = () => {
    const storageRef = ref(storage, "users/" + user?.uid);
    getDownloadURL(storageRef)
      .then(async (image) => {
        const q = query(
          collection(db, "posts"),
          where("userId", "==", user?.uid)
        );
        const postDocs = await getDocs(q);
        postDocs.forEach(async (item) => {
          await updateDoc(doc(db, "posts", item.id), {
            avatarUrl: image,
          });
        });
      })
      .catch((error) => alert(error.message));
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
