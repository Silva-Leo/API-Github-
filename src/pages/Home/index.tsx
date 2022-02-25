import { FormEvent, useState } from "react";
import { api } from "../../services/index";

import toast, { Toaster } from "react-hot-toast";

import { UserCard } from "../../components/UserCard";

import {
  Container,
  Form,
  ListUsers,
  Main,
  SectionUsers,
  Title,
  Wrapper
} from "./styles";

interface IUser {
  id: number;
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
}

export function Home() {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);

  async function fetchGithubUser() {
    try {
      const response = await api.get<IUser>(`${username}`);
      const { login, name, avatar_url, bio, id } = response.data;

      const user = {
        id,
        login,
        name,
        avatar_url,
        bio
      };

      setUsers([...users, user]);
      toast.success("Usuário encontrado");
    } catch (error) {
      toast.error("Opps! Não encontramos nenhum usuário");
      console.log(error);
    }
  }

  function handleSubmitForm(event: FormEvent) {
    event.preventDefault();

    if (username.trim() === "") {
      toast.error("Preencha o campo abaixo");

      return;
    }

    fetchGithubUser();
    setUsername("");
  }

  return (
    <Container>
      <Wrapper>

        <Main>
          <Title>
            API do Github <br/> Encontre um usuário e explore
          </Title>

          <Form onSubmit={handleSubmitForm}>
            <div className="group">
              <label htmlFor="user" className="sr-only">
                Digite um nome de usuário
              </label>
              <input
                type="text"
                id="user"
                placeholder="Digite aqui"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <button>Pesquisar</button>
            </div>
          </Form>

          <SectionUsers>
            <ListUsers>
              {users.map(user => (
                <UserCard
                  key={user.id}
                  name={user.name}
                  username={user.login}
                  description={user.bio}
                  avatar={user.avatar_url}
                />
              ))}
            </ListUsers>
          </SectionUsers>
        </Main>
      </Wrapper>
      <Toaster />
    </Container>
  );
}
