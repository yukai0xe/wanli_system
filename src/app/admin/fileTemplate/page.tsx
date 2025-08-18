'use client'
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button1 } from "@/app/components/button";
import DialogComponent from "@/app/components/dialog";
import InputComponent from "@/app/components/form/input";
import { FileType } from "@/types/enum";

const MainPage = () => {
  const [fileRef, setFileRef] = useState<fileObject | null>(null);
  const [filesList, setFilesList] = useState<Record<string, fileObject[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<fileObject[]>([]);
  const [addNewFile, setAddNewFile] = useState<boolean>(false);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!fileRef) return;

    const path =
      fileRef.type && fileRef.displayName
        ? `private/${fileRef.type}/${fileRef.id}`
        : `private/${fileRef.id}`;
  
    const { error } = await supabase.storage
      .from("wanli")
      .upload(path, fileRef.file, { upsert: true });
    
    if (error) {
      alert("上傳失敗: " + error.message);
    } else {
      alert("上傳成功!");
      setAddNewFile(false);
      setFileRef(null);
    }

    const accessToken = localStorage.getItem("access_token");
    fetch("/api/wanliFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        fileObject: {
          id: fileRef.id,
          displayName: fileRef.displayName,
          type: fileRef.type,
        },
        storagePath: path,
      }),
    })
      .then(res => {
        if (!res.ok) {
          alert("建立資料庫紀錄失敗");
        } else {
          fetchFilesList();
        }
      })

  };

  const fetchFilesList = async () => {
    const allFiles: Record<string, fileObject[]> = {};

    const accessToken = localStorage.getItem('access_token');
    const res = await fetch(`/api/wanliFile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const dbData: fileObject[] = await res.json();

    for (const data of dbData) {
      if (!(data.type in allFiles)) allFiles[data.type] = [];
      allFiles[data.type].push(data);
    }

    setFilesList(allFiles);
  };

  const toggleFile = (file: fileObject) => {
    setSelectedFiles((prev) =>
      prev.includes(file)
        ? prev.filter((f) => f !== file)
        : [...prev, file]
    );
  };

  const downloadSelectedFiles = async () => {
    for (const file of selectedFiles) {
      const { id, type, displayName } = file; 
      const { data, error } = await supabase.storage
        .from("wanli")
        .download(`private/${type}/${id}`);

      if (error) {
        console.error(`下載 ${displayName} 失敗`, error);
        continue;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = displayName || "不知名檔案"
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const deleteSelectedFiles = async () => {
    for (const file of selectedFiles) {
      const { type, displayName, id } = file;
      const { error } = await supabase.storage
        .from("wanli")
        .remove([`private/${type}/${id}`]);

      if (error) {
        console.error(`刪除 ${displayName} 失敗`, error);
      }
    }
    const accessToken = localStorage.getItem("access_token");
    const idArray = selectedFiles.map(f => f.id);
    setSelectedFiles([]);
    fetch("/api/wanliFile", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        idArray,
      }),
    }).then((res) => {
      if (!res.ok) {
        alert("刪除資料庫紀錄失敗");
      } else {
        fetchFilesList();
      }
    });
    
  };

  useEffect(() => {
    fetchFilesList();
  }, []);

  return (
    <div className="flex flex-col items-center gap-y-5 pt-10 px-10">
      <div className="mt-5 w-5/6 border-solid border-b-4 border-stone-500 flex pb-3 items-end">
        <h3 className="font-bold text-2xl rounded text-left mr-auto">
          已上傳檔案
        </h3>
        <div className="flex gap-x-5 items-center">
          <Button1
            disabled={!fileRef}
            handleClick={() => setAddNewFile(true)}
            className={`${!fileRef && "opacity-30"}`}
          >
            上傳檔案
          </Button1>
          <Button1 handleClick={() => handleUploadClick()}>
            {fileRef ? "重新選擇檔案" : "選擇檔案"}
          </Button1>
          {fileRef && <p>已選擇檔案: {fileRef.file.name}</p>}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) =>
              e.target.files &&
              setFileRef({
                id: crypto.randomUUID(),
                file: e.target.files[0],
                type: "firstMeeting",
                displayName: e.target.files[0].name,
              })
            }
          />
        </div>
      </div>
      <div className="min-h-40 w-5/6">
        {Object.entries(filesList).map(([type, files], idx) => {
          if (files.length !== 0) {
            return (
              <div key={idx}>
                <div className="border-b-8 border-solid border-red-300">
                  <p className="w-fit bg-red-300 text-lg p-3 rounded-t-lg">
                    {FileType[type as keyof typeof FileType]}
                  </p>
                </div>
                {files.map((f, idx) => (
                  <label
                    key={idx}
                    className="flex items-center justify-between gap-2 p-4 hover:bg-yellow-200 transition duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(f)}
                      onChange={() => toggleFile(f)}
                    />
                    <span>{f.displayName}</span>
                  </label>
                ))}
              </div>
            );
          }
        })}
        {Object.values(filesList).every((files) => files.length === 0) && (
          <p className="text-center text-xl">沒有上傳任何檔案</p>
        )}
      </div>
      <div className="flex gap-x-3">
        <Button1 handleClick={() => downloadSelectedFiles()}>下載</Button1>
        <Button1
          style={{
            backgroundColor: "var(--tertiary-color)",
            color: "var(--white-2)",
          }}
          handleClick={() => deleteSelectedFiles()}
          animate
        >
          刪除
        </Button1>
      </div>
      <DialogComponent
        title="上傳新檔案"
        open={addNewFile}
        button={{
          cancel: "取 消",
          confirm: "新 增",
        }}
        handleClose={() => setAddNewFile(false)}
        handleConfirm={() => handleUpload()}
      >
        <InputComponent
          direction
          input={{
            type: "select",
            value: Object.entries(FileType).map(([key, value]) => {
              return {
                label: value,
                value: key,
              };
            }),
          }}
          label={"選擇檔案類型"}
          inputChangeHandler={(v: string) => {
            if (fileRef) {
              setFileRef({
                id: fileRef?.id,
                file: fileRef?.file,
                displayName: fileRef?.displayName,
                type: v,
              });
            }
          }}
        />
        <InputComponent
          direction
          input={{ type: "text" }}
          label={"檔案名稱"}
          placeholder={"輸入檔案名稱"}
          value={fileRef?.displayName || ""}
          inputChangeHandler={(v: string) => {
            if (fileRef) {
              setFileRef({
                id: fileRef?.id,
                file: fileRef?.file,
                displayName: v,
                type: fileRef.type,
              });
            }
          }}
        />
      </DialogComponent>
    </div>
  );
};

export default MainPage;
