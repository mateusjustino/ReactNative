import React, { useRef } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { Feather } from "@expo/vector-icons"; // Importe o ícone Feather do Expo Icons

const AddEditNote = () => {
  const richText = useRef(null);

  // Função para salvar a nota
  const saveNote = () => {
    richText.current?.getContentHtml().then((html) => {
      // Lógica para salvar a nota
      alert("Nota salva com sucesso!");
    });
  };

  // Mapeamento de ícones personalizado para a RichToolbar
  const customIconMap = {
    bold: () => <Feather name="bold" size={24} color="black" />,
    italic: () => <Feather name="italic" size={24} color="black" />,
    unorderedList: () => <Feather name="list" size={24} color="black" />,
    orderedList: () => <Feather name="list" size={24} color="black" />,
    link: () => <Feather name="link" size={24} color="black" />,
    image: () => <Feather name="image" size={24} color="black" />,
    // Adicione outros ícones aqui conforme necessário
  };

  return (
    <View style={{ flex: 1 }}>
      <RichEditor
        ref={richText}
        initialContentHTML={""} // Nota inicial vazia
        style={editorStyles.editor}
      />
      <RichToolbar
        style={toolbarStyles.toolbar}
        editor={richText}
        iconMap={customIconMap} // Use o mapeamento de ícones personalizado
        actions={[
          "bold", // Adiciona negrito
          "italic", // Adiciona itálico
          "unorderedList", // Adiciona lista não ordenada
          "orderedList", // Adiciona lista ordenada
          "link", // Adiciona link
          "image", // Adiciona imagem
        ]}
        selectedButtonStyle={{ backgroundColor: "gray" }} // Estilo do botão selecionado
        disabledButtonStyle={{ backgroundColor: "lightgray" }} // Estilo do botão desativado
      />
      <TouchableOpacity
        onPress={saveNote}
        style={{ padding: 10, backgroundColor: "blue", alignItems: "center" }}
      >
        <Text style={{ color: "white" }}>Salvar Nota</Text>
      </TouchableOpacity>
    </View>
  );
};

const editorStyles = StyleSheet.create({
  editor: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

const toolbarStyles = StyleSheet.create({
  toolbar: {
    backgroundColor: "#F5FCFF",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    paddingHorizontal: 8,
  },
});

export default AddEditNote;
