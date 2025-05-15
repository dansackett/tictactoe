import classnames from 'classnames';

interface ModeButtonProps {
  label: string;
  selectedMode: string;
  mode: string;
  onClick: ()=> void;
}

const ModeButton = ({ label, selectedMode, mode, onClick }: ModeButtonProps)=> {
  return (
      <button
        type="button"
        className={classnames('cursor-pointer text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none focus:ring-2', {
          'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300': selectedMode === mode,
          'bg-gray-800 hover:bg-gray-900 focus:ring-gray-300': selectedMode !== mode
        })}
        onClick={onClick}
      >
        { label }
      </button>
  );
};

export default ModeButton;
