import { useState, useCallback } from 'react';
import axios from 'axios';
import ReactFlow, { Node, Background, Controls, Position, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

const initialNodes: Node[] = [
  { id: 'explore-categories', data: { label: 'Explore Categories' }, position: { x: 250, y: 0 }, sourcePosition: Position.Right },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [view, setView] = useState<'details' | 'ingredients' | 'tags'>('details');

  const fetchCategories = useCallback(async () => {
    if (categoriesLoaded) return;

    try {
      const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
      const categories = response.data.categories;

      const categoryNodes = categories.map((cat: any, index: number) => ({
        id: `cat-${cat.idCategory}`,
        data: { label: cat.strCategory },
        position: { x: 150 + index * 150, y: 150 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }));

      const categoryEdges = categories.map((cat: any) => ({
        id: `e1-${cat.idCategory}`,
        source: 'explore-categories',
        target: `cat-${cat.idCategory}`,
      }));

      setNodes((nds) => [...nds, ...categoryNodes]);
      setEdges((eds) => [...eds, ...categoryEdges]);
      setCategoriesLoaded(true);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [categoriesLoaded, setNodes, setEdges]);

  const fetchMealsByCategory = async (category: string) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      const meals = response.data.meals;

      if (!meals) {
        throw new Error('No meals found for this category.');
      }

      const mealNodes = meals.map((meal: { idMeal: any; strMeal: any; strMealThumb: any; }, index: number) => ({
        id: `meal-${meal.idMeal}`,
        data: { label: meal.strMeal, image: meal.strMealThumb },
        position: { x: 150 + index * 150, y: 300 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      }));

      const mealEdges = meals.map((meal: { idMeal: any; }) => ({
        id: `e-cat-${category}-${meal.idMeal}`,
        source: `cat-${category}`,
        target: `meal-${meal.idMeal}`,
      }));

      setNodes((nds) => [
        ...nds.filter((n) => !n.id.startsWith('meal-')), 
        ...mealNodes,
      ]);

      setEdges((eds) => [
        ...eds.filter((e) => e.source !== `cat-${category}`),
        ...mealEdges,
      ]);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const fetchMealDetails = async (mealId: string) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      setSelectedMeal(response.data.meals[0]);
    } catch (error) {
      console.error('Error fetching meal details:', error);
    }
  };


  const onNodeClick = (_event: any, node: Node) => {
    if (node.id === 'explore-categories') {
      fetchCategories(); 
    } else if (node.id.startsWith('cat')) {
      const categoryName = node.data.label;
      fetchMealsByCategory(categoryName); 
    } else if (node.id.startsWith('meal')) {
      const mealId = node.id.replace('meal-', '');
      fetchMealDetails(mealId); 
    }
  };

  const closeSidebar = () => {
    setSelectedMeal(null);
  };

  return (
    <>
      <h4>Food Explorer</h4>
      <div className="App">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
        >
          <Background />
          <Controls />
        </ReactFlow>

        {selectedMeal && (
          <div className="sidebar">
            <button className="close-button" onClick={closeSidebar}>✖</button> 
            <h3>{selectedMeal.strMeal}</h3>
            <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />

            <div className="view-buttons">
              <button onClick={() => setView('details')}>View Details</button>
              <button onClick={() => setView('ingredients')}>View Ingredients</button>
              <button onClick={() => setView('tags')}>View Tags</button>
            </div>

            {view === 'details' && (
              <>
                <h4>Instructions</h4>
                <p>{selectedMeal.strInstructions}</p>
              </>
            )}

            {view === 'ingredients' && (
              <>
                <h4>Ingredients</h4>
                <ul>
                  {Object.keys(selectedMeal)
                    .filter((key) => key.startsWith('strIngredient') && selectedMeal[key])
                    .map((ingredientKey, index) => (
                      <li key={index}>{selectedMeal[ingredientKey]}</li>
                    ))}
                </ul>
              </>
            )}

            {view === 'tags' && selectedMeal.strTags && (
              <>
                <h4>Tags</h4>
                <p>{selectedMeal.strTags.split(',').join(', ')}</p>
              </>
            )}

            {view === 'tags' && !selectedMeal.strTags && <p>No tags available for this meal.</p>}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
