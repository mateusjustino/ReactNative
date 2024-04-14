import { WebView } from "react-native-webview";
import React, { useRef } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";

const EditorScreen = () => {
  const webViewRef = useRef(null);

  const handleLoadEditor = () => {
    const editorInitializationScript = `
      import EditorJS from '@editorjs/editorjs';
      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {}
      });
    `;

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(editorInitializationScript);
    }
  };

  const handleSave = async () => {
    const saveScript = `
      editor.save()
        .then((outputData) => {
          window.ReactNativeWebView.postMessage(JSON.stringify(outputData));
        })
        .catch((error) => {
          console.error('Erro ao salvar:', error);
        });
    `;

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(saveScript);
    }
  };

  const handleMessage = (event) => {
    const content = JSON.parse(event.nativeEvent.data);
    Alert.alert("Conteúdo do Editor.js", JSON.stringify(content));
  };

  const editorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Editor.js Test</title>
      <!-- Incluir a biblioteca Editor.js -->
      <script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>
    </head>
    <body>
      <!-- Este é o contêiner onde o Editor.js será renderizado -->
      <div id="editorjs"></div>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        javaScriptEnabled={true}
        source={{ html: editorHtml }} // Inserir o código HTML diretamente aqui
        onLoad={handleLoadEditor}
        onMessage={handleMessage}
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EditorScreen;
