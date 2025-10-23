import React, { useState, useCallback, useEffect } from 'react';
import { SceneOutput, Character, Creation } from './types';
import { generateScenePrompts } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import Modal from './components/Modal';
import CharacterCreator from './components/CharacterCreator';
import CharacterDisplay from './components/CharacterDisplay';
import CharacterSelector from './components/CharacterSelector';
import { UserIcon } from './components/icons/UserIcon';
import CreationsList from './components/CreationsList';
import SceneDetail from './components/SceneDetail';

import { fetchCharacter, saveCharacter, deleteCharacter, fetchCreations, saveCreation, deleteCreation } from './services/apiService';


const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [result, setResult] = useState<SceneOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [creations, setCreations] = useState<Creation[]>([]);
  const [viewingCreation, setViewingCreation] = useState<Creation | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedCharacter = await fetchCharacter();
        if (fetchedCharacter) {
          setCharacter(fetchedCharacter);
          setCharacters([fetchedCharacter]);
          setSelectedCharacter(fetchedCharacter);
        }
        const fetchedCreations = await fetchCreations();
        if (fetchedCreations) {
          setCreations(fetchedCreations);
        }
      } catch (e) {
        console.error("Failed to load data from backend", e);
        setError("Failed to load saved data. Please try again later.");
      }
    };
    loadData();
  }, []);

  const handleSaveCharacter = async (newCharacter: Character) => {
    try {
      const savedChar = await saveCharacter(newCharacter);
      setCharacter(savedChar); // Update with the character returned from the backend (with ID)
      
      // Add to characters list if not already there
      setCharacters(prev => {
        const exists = prev.some(char => char.name === savedChar.name);
        if (!exists) {
          return [...prev, savedChar];
        }
        return prev.map(char => char.name === savedChar.name ? savedChar : char);
      });
      
      setSelectedCharacter(savedChar);
      setIsModalOpen(false);
    } catch (e) {
      console.error("Failed to save character to backend", e);
      setError("Failed to save character. Please try again.");
    }
  };
  
  const handleDeleteCharacter = async () => {
    if (window.confirm("Are you sure you want to delete this character?")) {
      try {
        if (character && character.id) {
          await deleteCharacter(character.id);
          setCharacter(null);
        }
      } catch (e) {
        console.error("Failed to delete character from backend", e);
        setError("Failed to delete character. Please try again.");
      }
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!idea.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedResult = await generateScenePrompts(idea, selectedCharacter);
      setResult(generatedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [idea, isLoading, selectedCharacter]);

  const handleCreationComplete = async (scene: SceneOutput) => {
    try {
      const newCreation: Creation = {
        ...scene,
        generatedImage: '', // No image generation, just prompts
      };
      const savedCreation = await saveCreation(newCreation);
      setCreations((prevCreations) => [...prevCreations, savedCreation]);
      setResult(null); // Clear the current prompt display
    } catch (e) {
      console.error("Failed to save creation to backend", e);
      setError("Failed to save creation. Please try again.");
    }
  };

  const handleDeleteCreation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this saved creation?")) {
      try {
        await deleteCreation(id);
        setCreations((prevCreations) => prevCreations.filter(c => c.id !== id));
        if (viewingCreation && viewingCreation.id === id) {
          setViewingCreation(null);
        }
      } catch (e) {
        console.error("Failed to delete creation from backend", e);
        setError("Failed to delete creation. Please try again.");
      }
    }
  };

  const handleViewCreation = (creation: Creation) => {
    setViewingCreation(creation);
  };

  const handleBackToList = () => {
    setViewingCreation(null);
  };

  const handleUpdateCreationImage = async (id: string, imageUrl: string, imageFilename?: string) => {
    try {
      // Update the creation in the state
      setCreations((prevCreations) => 
        prevCreations.map(c => 
          c.id === id ? { 
            ...c, 
            generatedImage: imageUrl,
            image_filename: imageFilename || c.image_filename
          } : c
        )
      );
      
      // Update the viewing creation if it's the same one
      if (viewingCreation && viewingCreation.id === id) {
        setViewingCreation({ 
          ...viewingCreation, 
          generatedImage: imageUrl,
          image_filename: imageFilename || viewingCreation.image_filename
        });
      }
    } catch (e) {
      console.error("Failed to update creation image", e);
      setError("Failed to update scene image. Please try again.");
    }
  };

  // If viewing a creation detail, show the detail page
  if (viewingCreation) {
    const creationCharacter = characters.find(char => 
      viewingCreation.title.toLowerCase().includes(char.name.toLowerCase())
    );
    
    return (
      <SceneDetail
        creation={viewingCreation}
        character={creationCharacter || null}
        onBack={handleBackToList}
        onUpdateImage={handleUpdateCreationImage}
        onDelete={handleDeleteCreation}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <Header />
        <main>
          <section className="mb-8 p-6 bg-gray-800/50 border border-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-200">Your Character</h3>
            {character ? (
              <CharacterDisplay 
                character={character} 
                onEdit={() => setIsModalOpen(true)} 
                onDelete={handleDeleteCharacter} 
              />
            ) : (
              <div className="text-center">
                <p className="text-gray-400 mb-4">Create a character to use as a reference for image generation.</p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <UserIcon />
                  Create Your Character
                </button>
              </div>
            )}
          </section>

          <p className="text-center text-gray-400 mb-4 max-w-2xl mx-auto text-sm px-4">
            Describe your anime scene concept below. Our AI Director will craft the perfect image and video prompts to bring your vision to life.
          </p>
          
          <CharacterSelector 
            characters={characters}
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
          />
          
          <InputForm
            idea={idea}
            setIdea={setIdea}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          {isLoading && <Loader />}
          {error && <ErrorDisplay message={error} />}
          {result && !isLoading && (
            <ResultDisplay 
              result={result} 
              character={selectedCharacter} 
              onCreationComplete={handleCreationComplete}
            />
          )}

          <CreationsList 
            creations={creations} 
            characters={characters}
            onDelete={handleDeleteCreation} 
            onView={handleViewCreation}
          />
        </main>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <CharacterCreator 
          onSave={handleSaveCharacter}
          onClose={() => setIsModalOpen(false)}
          existingCharacter={character}
        />
      </Modal>
    </div>
  );
};

export default App;
