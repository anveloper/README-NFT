import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";

const NftItem = (props: any) => {
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");

  const getMetadata = async (metaDataURI: string) => {
    try {
      await axios({ url: metaDataURI }).then((res: any) => {
        const { fileName, name, author, description, imageURL } = res.data;
        setFileName(fileName);
        setName(name);
        setAuthor(author);
        setDescription(description);
        setImageURL(imageURL);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const { metaDataURI } = props;
    getMetadata(metaDataURI);
  }, [props]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Suspense fallback={<p>이미지 로딩중</p>}>
        <img src={imageURL} alt="" width={240} />
      </Suspense>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>fileName: {fileName}</div>
        <div>name: {name}</div>
        <div>author: {author}</div>
        <div>description: {description}</div>
      </div>
    </div>
  );
};

export default NftItem;
